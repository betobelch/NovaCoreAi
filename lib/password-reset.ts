import { randomInt, randomUUID } from "crypto"
import { getStore } from "@netlify/blobs"
import { hashPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"
import { getUserByEmail, updateUserPasswordHash, usesBlobUserStore } from "@/lib/user-store"
import { normalizeEmail } from "@/lib/users"

type StoredPasswordResetRequest = {
  id: string
  email: string
  code: string
  expiresAt: number
  verifiedToken: string | null
  verifiedUntil: number | null
  used: boolean
  createdAt: number
}

const RESET_CODE_TTL_MS = 15 * 60 * 1000
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000
const resetRequestStoreKey = "password-reset-requests"

function getPasswordResetStore() {
  return getStore("novacore-password-reset")
}

function normalizeResetRequest(request: any): StoredPasswordResetRequest | null {
  const id = String(request?.id ?? "").trim()
  const email = String(request?.email ?? "").trim().toLowerCase()
  const code = String(request?.code ?? "").replace(/\D/g, "")
  const expiresAt =
    request?.expiresAt instanceof Date ? request.expiresAt.getTime() : Number(request?.expiresAt ?? 0)

  if (!id || !email || !code || !Number.isFinite(expiresAt)) return null

  const verifiedUntil =
    request?.verifiedUntil instanceof Date
      ? request.verifiedUntil.getTime()
      : request?.verifiedUntil
        ? Number(request.verifiedUntil)
        : null

  return {
    id,
    email,
    code,
    expiresAt,
    verifiedToken: request?.verifiedToken ? String(request.verifiedToken) : null,
    verifiedUntil: verifiedUntil && Number.isFinite(verifiedUntil) ? verifiedUntil : null,
    used: Boolean(request?.used),
    createdAt:
      request?.createdAt instanceof Date
        ? request.createdAt.getTime()
        : Number(request?.createdAt ?? Date.now()),
  }
}

function isResetRequestActive(request: StoredPasswordResetRequest, now = Date.now()) {
  return !request.used && request.expiresAt >= now && (!request.verifiedUntil || request.verifiedUntil >= now)
}

async function readBlobResetRequests() {
  const storedRequests = await getPasswordResetStore().get(resetRequestStoreKey, { type: "json" })

  if (!Array.isArray(storedRequests)) return []

  return storedRequests.map(normalizeResetRequest).filter(Boolean) as StoredPasswordResetRequest[]
}

async function writeBlobResetRequests(requests: StoredPasswordResetRequest[]) {
  await getPasswordResetStore().setJSON(resetRequestStoreKey, requests.filter((request) => isResetRequestActive(request)))
}

async function removeExpiredRequests() {
  const now = Date.now()

  if (usesBlobUserStore) {
    await writeBlobResetRequests((await readBlobResetRequests()).filter((request) => isResetRequestActive(request, now)))
    return
  }

  await prisma.passwordResetRequest.deleteMany({
    where: {
      OR: [
        { used: true },
        { expiresAt: { lt: new Date(now) } },
        { verifiedUntil: { lt: new Date(now) } },
      ],
    },
  })
}

export async function createPasswordResetRequest(email: string) {
  await removeExpiredRequests()

  const normalizedEmail = normalizeEmail(email)
  const user = await getUserByEmail(normalizedEmail)

  if (!user) return null

  const code = String(randomInt(100000, 999999))
  const expiresAt = Date.now() + RESET_CODE_TTL_MS

  if (usesBlobUserStore) {
    const requests = (await readBlobResetRequests()).filter((request) => request.email !== normalizedEmail)
    const request: StoredPasswordResetRequest = {
      id: randomUUID(),
      email: normalizedEmail,
      code,
      expiresAt,
      verifiedToken: null,
      verifiedUntil: null,
      used: false,
      createdAt: Date.now(),
    }

    await writeBlobResetRequests([...requests, request])

    return {
      id: request.id,
      email: request.email,
      code: request.code,
      expiresAt: request.expiresAt,
    }
  }

  await prisma.passwordResetRequest.deleteMany({ where: { email: normalizedEmail } })
  const request = await prisma.passwordResetRequest.create({
    data: {
      id: randomUUID(),
      email: normalizedEmail,
      code,
      expiresAt: new Date(expiresAt),
    },
  })

  return {
    id: request.id,
    email: request.email,
    code: request.code,
    expiresAt: request.expiresAt.getTime(),
  }
}

export async function verifyPasswordResetCode(resetId: string, code: string) {
  await removeExpiredRequests()

  const normalizedCode = code.replace(/\D/g, "")

  if (usesBlobUserStore) {
    const requests = await readBlobResetRequests()
    const request = requests.find((item) => item.id === resetId)

    if (!request || !isResetRequestActive(request) || request.code !== normalizedCode) {
      return null
    }

    const verifiedToken = randomUUID()
    const verifiedUntil = Date.now() + RESET_TOKEN_TTL_MS

    await writeBlobResetRequests(
      requests.map((item) =>
        item.id === resetId
          ? {
              ...item,
              verifiedToken,
              verifiedUntil,
            }
          : item,
      ),
    )

    return {
      resetToken: verifiedToken,
      expiresAt: verifiedUntil,
    }
  }

  const request = await prisma.passwordResetRequest.findUnique({ where: { id: resetId } })

  if (!request || request.used || request.expiresAt.getTime() < Date.now() || request.code !== normalizedCode) {
    return null
  }

  const verifiedToken = randomUUID()
  const verifiedUntil = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.passwordResetRequest.update({
    where: { id: resetId },
    data: {
      verifiedToken,
      verifiedUntil,
    },
  })

  return {
    resetToken: verifiedToken,
    expiresAt: verifiedUntil.getTime(),
  }
}

export async function resetPasswordWithToken(resetToken: string, password: string) {
  await removeExpiredRequests()

  if (usesBlobUserStore) {
    const requests = await readBlobResetRequests()
    const request = requests.find(
      (item) => item.verifiedToken === resetToken && !item.used && Boolean(item.verifiedUntil && item.verifiedUntil >= Date.now()),
    )

    if (!request) return null

    const user = await getUserByEmail(request.email)

    if (!user) return null

    await updateUserPasswordHash(user.id, hashPassword(password))
    await writeBlobResetRequests(
      requests.map((item) => (item.id === request.id ? { ...item, used: true } : item)),
    )

    return user
  }

  const request = await prisma.passwordResetRequest.findFirst({
    where: {
      verifiedToken: resetToken,
      used: false,
      verifiedUntil: { gte: new Date() },
    },
  })

  if (!request) return null

  const user = await getUserByEmail(request.email)

  if (!user) return null

  await updateUserPasswordHash(user.id, hashPassword(password))
  await prisma.passwordResetRequest.update({
    where: { id: request.id },
    data: { used: true },
  })

  return user
}
