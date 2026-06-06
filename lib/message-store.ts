import { getStore } from "@netlify/blobs"
import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/user-store"

export type StoredAttachment = {
  id: string
  name: string
  size: number
  type: string
  dataUrl?: string
}

export type StoredMessage = {
  id: string
  userId: string
  author: "client" | "admin"
  name: string
  text: string
  attachments: StoredAttachment[]
  createdAt: string
  client?: {
    id: string
    name: string
    company: string
    email: string
    cpf?: string
  }
}

type MessageClientInput = {
  id: string
  name?: string
  company?: string | null
  email?: string
  cpf?: string
}

const messageStoreKey = "messages"
const isNetlifyRuntime = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getMessageStore() {
  return getStore("novacore-chat")
}

function sortMessages(messages: StoredMessage[]) {
  return [...messages].sort((first, second) => first.createdAt.localeCompare(second.createdAt))
}

function normalizeAttachment(attachment: any): StoredAttachment | null {
  const id = String(attachment?.id ?? "").trim()
  const name = String(attachment?.name ?? "").trim()
  const size = Number(attachment?.size ?? 0)
  const type = String(attachment?.type ?? "Arquivo").trim() || "Arquivo"
  const dataUrl = String(attachment?.dataUrl ?? "").trim()

  if (!id || !name || !Number.isFinite(size) || size < 0) return null

  return {
    id,
    name,
    size,
    type,
    ...(dataUrl ? { dataUrl } : {}),
  }
}

function normalizeAttachments(attachments: unknown): StoredAttachment[] {
  if (!Array.isArray(attachments)) return []

  return attachments.map(normalizeAttachment).filter(Boolean) as StoredAttachment[]
}

function parseStoredAttachments(attachments: unknown): StoredAttachment[] {
  if (Array.isArray(attachments)) return normalizeAttachments(attachments)
  if (typeof attachments !== "string" || !attachments.trim()) return []

  try {
    return normalizeAttachments(JSON.parse(attachments))
  } catch {
    return []
  }
}

function stringifyAttachments(attachments: StoredAttachment[]) {
  return attachments.length > 0 ? JSON.stringify(attachments) : null
}

function toIsoString(value: Date | string) {
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

function normalizeBlobMessage(message: any): StoredMessage | null {
  const id = String(message?.id ?? "").trim()
  const userId = String(message?.userId ?? "").trim()
  const author = String(message?.author ?? "").trim()
  const text = String(message?.text ?? "").trim()
  const createdAt = String(message?.createdAt ?? "").trim()

  if (!id || !userId || (author !== "client" && author !== "admin") || !text || !createdAt) return null

  return {
    id,
    userId,
    author,
    name: String(message?.name ?? "").trim() || (author === "admin" ? "NovaCore AI" : "Cliente"),
    text,
    attachments: parseStoredAttachments(message?.attachments),
    createdAt,
    client: message?.client
      ? {
          id: String(message.client.id ?? userId),
          name: String(message.client.name ?? "Cliente"),
          company: String(message.client.company ?? ""),
          email: String(message.client.email ?? ""),
          cpf: String(message.client.cpf ?? ""),
        }
      : undefined,
  }
}

async function readBlobMessages() {
  const messages = await getMessageStore().get(messageStoreKey, { type: "json" })

  return Array.isArray(messages) ? (messages.map(normalizeBlobMessage).filter(Boolean) as StoredMessage[]) : []
}

async function writeBlobMessages(messages: StoredMessage[]) {
  await getMessageStore().setJSON(messageStoreKey, sortMessages(messages))
}

export async function listMessages(userId?: string) {
  if (isNetlifyRuntime) {
    const messages = await readBlobMessages()
    return sortMessages(userId ? messages.filter((message) => message.userId === userId) : messages)
  }

  const whereClause = userId ? `WHERE msg."userId" = ?` : ""
  const messages = await prisma.$queryRawUnsafe<
    Array<{
      id: string
      userId: string
      author: string
      name: string
      text: string
      attachments: string | null
      createdAt: Date | string
      clientId: string | null
      clientName: string | null
      clientCompany: string | null
      clientEmail: string | null
      clientCpf: string | null
    }>
  >(
    `
      SELECT
        msg."id",
        msg."userId",
        msg."author",
        msg."name",
        msg."text",
        msg."attachments",
        msg."createdAt",
        client."id" AS "clientId",
        client."name" AS "clientName",
        client."company" AS "clientCompany",
        client."email" AS "clientEmail",
        client."cpf" AS "clientCpf"
      FROM "Message" msg
      LEFT JOIN "User" client ON client."id" = msg."userId"
      ${whereClause}
      ORDER BY msg."createdAt" ASC
    `,
    ...(userId ? [userId] : []),
  )

  return messages.map((message) => ({
    id: message.id,
    userId: message.userId,
    author: message.author as "client" | "admin",
    name: message.name,
    text: message.text,
    attachments: parseStoredAttachments(message.attachments),
    createdAt: toIsoString(message.createdAt),
    client: message.clientId
      ? {
          id: message.clientId,
          name: message.clientName ?? "Cliente",
          company: message.clientCompany ?? "",
          email: message.clientEmail ?? "",
          cpf: message.clientCpf ?? "",
        }
      : undefined,
  }))
}

export async function createMessage(input: {
  userId: string
  author: "client" | "admin"
  text: string
  attachments?: StoredAttachment[]
  client?: MessageClientInput
}) {
  const attachments = normalizeAttachments(input.attachments)

  if (isNetlifyRuntime) {
    const messages = await readBlobMessages()
    const existingClient = messages.find((message) => message.userId === input.userId)?.client
    const client = {
      id: input.userId,
      name: input.client?.name || existingClient?.name || "Cliente",
      company: input.client?.company || existingClient?.company || "",
      email: input.client?.email || existingClient?.email || "",
      cpf: input.client?.cpf || existingClient?.cpf || "",
    }
    const message: StoredMessage = {
      id: createMessageId(),
      userId: input.userId,
      author: input.author,
      name: input.author === "admin" ? "NovaCore AI" : client.name,
      text: input.text,
      attachments,
      createdAt: new Date().toISOString(),
      client,
    }

    await writeBlobMessages([...messages, message])

    return message
  }

  const user = await getUserById(input.userId)

  if (!user) return null

  const messageId = createMessageId()
  const createdAt = new Date()
  const messageName = input.author === "admin" ? "NovaCore AI" : user.name

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO "Message" ("id", "userId", "author", "name", "text", "attachments", "createdAt")
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    messageId,
    input.userId,
    input.author,
    messageName,
    input.text,
    stringifyAttachments(attachments),
    createdAt.toISOString(),
  )

  return {
    id: messageId,
    userId: input.userId,
    author: input.author,
    name: messageName,
    text: input.text,
    attachments,
    createdAt: createdAt.toISOString(),
    client: {
      id: user.id,
      name: user.name,
      company: user.company ?? "",
      email: user.email,
      cpf: user.cpf,
    },
  }
}
