import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serializeNotification } from "@/lib/notifications"

const recipientRoles = ["client", "admin"]
const notificationActions = ["read", "unread", "archive"]

function getNotificationWhere(audience: string, userId?: string) {
  if (audience === "admin") {
    return {
      recipientRole: "admin",
      archivedAt: null,
    }
  }

  return {
    recipientRole: "client",
    recipientId: userId,
    archivedAt: null,
  }
}

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

  const where = getNotificationWhere(audience, userId)

  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.notification.count({
      where: {
        ...where,
        readAt: null,
      },
    }),
    prisma.notification.count({ where }),
  ])

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

    const scopeWhere = getNotificationWhere(audience, userId)
    const where = {
      ...scopeWhere,
      ...(markAll ? {} : { id: { in: ids } }),
    }
    const now = new Date()
    const data =
      action === "archive"
        ? { archivedAt: now, readAt: now }
        : action === "unread"
          ? { readAt: null }
          : { readAt: now }

    await prisma.notification.updateMany({
      where,
      data,
    })

    const [notifications, unreadCount, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: scopeWhere,
        orderBy: { createdAt: "desc" },
        take: 80,
      }),
      prisma.notification.count({
        where: {
          ...scopeWhere,
          readAt: null,
        },
      }),
      prisma.notification.count({ where: scopeWhere }),
    ])

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
