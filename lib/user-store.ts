import { getStore } from "@netlify/blobs"
import { prisma } from "@/lib/prisma"

export type StoredUser = {
  id: string
  name: string
  company: string | null
  cpf: string
  phone: string | null
  email: string
  passwordHash: string
  role: string
  createdAt: string
  updatedAt: string
}

type CreateUserInput = {
  name: string
  company: string | null
  cpf: string
  phone: string | null
  email: string
  passwordHash: string
  role?: string
}

const userStoreKey = "users"

export const usesBlobUserStore = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)

function createUserId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getUserStore() {
  return getStore("novacore-users")
}

function sortUsers(users: StoredUser[]) {
  return [...users].sort((first, second) => second.createdAt.localeCompare(first.createdAt))
}

function normalizeNullableText(value: unknown) {
  const text = String(value ?? "").trim()

  return text || null
}

function normalizeUser(user: any): StoredUser | null {
  const id = String(user?.id ?? "").trim()
  const email = String(user?.email ?? "").trim().toLowerCase()
  const cpf = String(user?.cpf ?? "").trim()
  const name = String(user?.name ?? "").trim()
  const passwordHash = String(user?.passwordHash ?? "").trim()

  if (!id || !email || !cpf || !name || !passwordHash) return null

  return {
    id,
    name,
    company: normalizeNullableText(user?.company),
    cpf,
    phone: normalizeNullableText(user?.phone),
    email,
    passwordHash,
    role: String(user?.role ?? "client").trim() || "client",
    createdAt: user?.createdAt instanceof Date ? user.createdAt.toISOString() : String(user?.createdAt ?? new Date().toISOString()),
    updatedAt: user?.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user?.updatedAt ?? new Date().toISOString()),
  }
}

async function readPrismaUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return sortUsers(users.map(normalizeUser).filter(Boolean) as StoredUser[])
}

async function readBlobUsers() {
  const storedUsers = await getUserStore().get(userStoreKey, { type: "json" })

  if (Array.isArray(storedUsers)) {
    return sortUsers(storedUsers.map(normalizeUser).filter(Boolean) as StoredUser[])
  }

  try {
    const seededUsers = await readPrismaUsers()

    if (seededUsers.length > 0) {
      await writeBlobUsers(seededUsers)
    }

    return seededUsers
  } catch {
    return []
  }
}

async function writeBlobUsers(users: StoredUser[]) {
  await getUserStore().setJSON(userStoreKey, sortUsers(users))
}

export function serializeAuthUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    company: user.company,
    cpf: user.cpf,
    phone: user.phone,
    email: user.email,
    role: user.role,
  }
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (usesBlobUserStore) {
    return (await readBlobUsers()).find((user) => user.email === normalizedEmail) ?? null
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  return user ? normalizeUser(user) : null
}

export async function getUserByCpf(cpf: string) {
  const normalizedCpf = cpf.trim()

  if (usesBlobUserStore) {
    return (await readBlobUsers()).find((user) => user.cpf === normalizedCpf) ?? null
  }

  const user = await prisma.user.findUnique({ where: { cpf: normalizedCpf } })

  return user ? normalizeUser(user) : null
}

export async function getUserById(id: string) {
  const userId = id.trim()

  if (usesBlobUserStore) {
    return (await readBlobUsers()).find((user) => user.id === userId) ?? null
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  return user ? normalizeUser(user) : null
}

export async function listClientUsers() {
  if (usesBlobUserStore) {
    return (await readBlobUsers()).filter((user) => user.role === "client")
  }

  const users = await prisma.user.findMany({
    where: { role: "client" },
    orderBy: { createdAt: "desc" },
  })

  return sortUsers(users.map(normalizeUser).filter(Boolean) as StoredUser[])
}

export async function createUser(input: CreateUserInput) {
  if (usesBlobUserStore) {
    const users = await readBlobUsers()
    const now = new Date().toISOString()
    const user: StoredUser = {
      id: createUserId(),
      name: input.name,
      company: input.company,
      cpf: input.cpf,
      phone: input.phone,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? "client",
      createdAt: now,
      updatedAt: now,
    }

    await writeBlobUsers([user, ...users])

    return user
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      company: input.company,
      cpf: input.cpf,
      phone: input.phone,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? "client",
    },
  })

  return normalizeUser(user)
}

export async function updateUserPhone(userId: string, phone: string | null) {
  if (usesBlobUserStore) {
    const users = await readBlobUsers()
    const currentUser = users.find((user) => user.id === userId)

    if (!currentUser) return null

    const updatedUser = {
      ...currentUser,
      phone,
      updatedAt: new Date().toISOString(),
    }

    await writeBlobUsers(users.map((user) => (user.id === userId ? updatedUser : user)))

    return updatedUser
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { phone },
  })

  return normalizeUser(user)
}

export async function updateUserPasswordHash(userId: string, passwordHash: string) {
  if (usesBlobUserStore) {
    const users = await readBlobUsers()
    const currentUser = users.find((user) => user.id === userId)

    if (!currentUser) return null

    const updatedUser = {
      ...currentUser,
      passwordHash,
      updatedAt: new Date().toISOString(),
    }

    await writeBlobUsers(users.map((user) => (user.id === userId ? updatedUser : user)))

    return updatedUser
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  })

  return normalizeUser(user)
}
