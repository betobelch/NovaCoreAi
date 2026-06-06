import { NextResponse } from "next/server"
import { createMessage, listMessages, type StoredMessage } from "@/lib/message-store"
import { notifyMessageCreated } from "@/lib/notifications"

function serializeMessage(message: StoredMessage) {
  return {
    id: message.id,
    userId: message.userId,
    author: message.author,
    name: message.name,
    text: message.text,
    createdAt: message.createdAt,
    client: message.client,
  }
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
    const client = {
      id: userId,
      name: String(body.clientName ?? "").trim(),
      company: String(body.clientCompany ?? "").trim(),
      email: String(body.clientEmail ?? "").trim(),
      cpf: String(body.clientCpf ?? "").trim(),
    }

    if (!userId || !text) {
      return NextResponse.json({ message: "Informe cliente e mensagem." }, { status: 400 })
    }

    if (author !== "client" && author !== "admin") {
      return NextResponse.json({ message: "Autor invalido." }, { status: 400 })
    }

    const message = await createMessage({
      userId,
      author,
      text,
      client,
    })

    if (!message) {
      return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
    }

    if (!process.env.NETLIFY) {
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
    }

    return NextResponse.json({ ok: true, message: serializeMessage(message) })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
