import { NextResponse } from "next/server"
import { listNotifications, serializeNotification, updateNotifications } from "@/lib/notifications"

const recipientRoles = ["client", "admin"]
const notificationActions = ["read", "unread", "archive"]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const audience = String(searchParams.get("audience") ?? "client").trim()
  const userId = searchParams.get("userId")?.trim()
  const take = Math.min(Math.max(Number(searchParams.get("limit") ?? 80), 1), 120)

  if (!recipientRoles.includes(audience)) {
    return NextResponse.json({ message: "Audiencia invalida." }, { status: 400 })
  }

  if (audience === "client" && !userId) {
    return NextResponse.json({ message: "Informe o usuario." }, { status: 400 })
  }

  const { notifications, unreadCount, totalCount } = await listNotifications({
    audience: audience as "client" | "admin",
    userId,
    take,
  })

  return NextResponse.json({
    notifications: notifications.map(serializeNotification),
    unreadCount,
    totalCount,
  })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const audience = String(body.audience ?? "client").trim()
    const userId = String(body.userId ?? "").trim()
    const action = String(body.action ?? "read").trim()
    const ids = Array.isArray(body.ids) ? body.ids.map((id: unknown) => String(id).trim()).filter(Boolean) : []
    const markAll = Boolean(body.all)

    if (!recipientRoles.includes(audience)) {
      return NextResponse.json({ message: "Audiencia invalida." }, { status: 400 })
    }

    if (audience === "client" && !userId) {
      return NextResponse.json({ message: "Informe o usuario." }, { status: 400 })
    }

    if (!notificationActions.includes(action)) {
      return NextResponse.json({ message: "Acao invalida." }, { status: 400 })
    }

    if (!markAll && ids.length === 0) {
      return NextResponse.json({ message: "Informe as notificacoes." }, { status: 400 })
    }

    const { notifications, unreadCount, totalCount } = await updateNotifications({
      audience: audience as "client" | "admin",
      userId,
      action: action as "read" | "unread" | "archive",
      all: markAll,
      ids,
    })

    return NextResponse.json({
      ok: true,
      notifications: notifications.map(serializeNotification),
      unreadCount,
      totalCount,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
