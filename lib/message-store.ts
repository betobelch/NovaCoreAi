import { getStore } from "@netlify/blobs"
import { prisma } from "@/lib/prisma"

export type StoredMessage = {
  id: string
  userId: string
  author: "client" | "admin"
  name: string
  text: string
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

async function readBlobMessages() {
  const messages = await getMessageStore().get(messageStoreKey, { type: "json" })

  return Array.isArray(messages) ? (messages as StoredMessage[]) : []
}

async function writeBlobMessages(messages: StoredMessage[]) {
  await getMessageStore().setJSON(messageStoreKey, sortMessages(messages))
}

export async function listMessages(userId?: string) {
  if (isNetlifyRuntime) {
    const messages = await readBlobMessages()
    return sortMessages(userId ? messages.filter((message) => message.userId === userId) : messages)
  }

  const messages = await prisma.message.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          cpf: true,
        },
      },
    },
  })

  return messages.map((message) => ({
    id: message.id,
    userId: message.userId,
    author: message.author as "client" | "admin",
    name: message.name,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
    client: message.user
      ? {
          id: message.user.id,
          name: message.user.name,
          company: message.user.company ?? "",
          email: message.user.email,
          cpf: message.user.cpf,
        }
      : undefined,
  }))
}

export async function createMessage(input: {
  userId: string
  author: "client" | "admin"
  text: string
  client?: MessageClientInput
}) {
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
      createdAt: new Date().toISOString(),
      client,
    }

    await writeBlobMessages([...messages, message])

    return message
  }

  const user = await prisma.user.findUnique({ where: { id: input.userId } })

  if (!user) return null

  const message = await prisma.message.create({
    data: {
      userId: input.userId,
      author: input.author,
      name: input.author === "admin" ? "NovaCore AI" : user.name,
      text: input.text,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          cpf: true,
        },
      },
    },
  })

  return {
    id: message.id,
    userId: message.userId,
    author: message.author as "client" | "admin",
    name: message.name,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
    client: {
      id: message.user.id,
      name: message.user.name,
      company: message.user.company ?? "",
      email: message.user.email,
      cpf: message.user.cpf,
    },
  }
}
