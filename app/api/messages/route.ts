import { NextResponse } from "next/server"
import { createMessage, listMessages, type StoredAttachment, type StoredMessage } from "@/lib/message-store"
import { notifyMessageCreated } from "@/lib/notifications"

function serializeMessage(message: StoredMessage) {
  return {
    id: message.id,
    userId: message.userId,
    author: message.author,
    name: message.name,
    text: message.text,
    attachments: message.attachments,
    createdAt: message.createdAt,
    client: message.client,
  }
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

function normalizeAttachments(attachments: unknown) {
  if (!Array.isArray(attachments)) return []

  return attachments.map(normalizeAttachment).filter(Boolean) as StoredAttachment[]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")?.trim()

  const messages = await listMessages(userId)

  return NextResponse.json({ messages: messages.map(serializeMessage) })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId = String(body.userId ?? "").trim()
    const author = String(body.author ?? "").trim()
    const text = String(body.text ?? "").trim()
    const attachments = normalizeAttachments(body.attachments)
    const client = {
      id: userId,
      name: String(body.clientName ?? "").trim(),
      company: String(body.clientCompany ?? "").trim(),
      email: String(body.clientEmail ?? "").trim(),
      cpf: String(body.clientCpf ?? "").trim(),
    }

    if (!userId || (!text && attachments.length === 0)) {
      return NextResponse.json({ message: "Informe cliente e mensagem." }, { status: 400 })
    }

    if (author !== "client" && author !== "admin") {
      return NextResponse.json({ message: "Autor invalido." }, { status: 400 })
    }

    const message = await createMessage({
      userId,
      author,
      text: text || "Arquivo enviado.",
      attachments,
      client,
    })

    if (!message) {
      return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
    }

    try {
      await notifyMessageCreated(
        {
          id: message.id,
          userId: message.userId,
          author: message.author,
          name: message.name,
          text: message.text,
        },
        {
          id: message.client?.id ?? userId,
          name: message.client?.name ?? message.name,
          company: message.client?.company ?? "",
          email: message.client?.email ?? "",
        },
      )
    } catch {
      // The message should remain available even if a notification hook fails.
    }

    return NextResponse.json({ ok: true, message: serializeMessage(message) })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
