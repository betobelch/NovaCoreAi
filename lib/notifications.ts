import { getStore } from "@netlify/blobs"
import { prisma } from "@/lib/prisma"

export type NotificationRecipientRole = "client" | "admin"
export type NotificationType =
  | "message"
  | "payment_due"
  | "payment_paid"
  | "payment_status"
  | "client_registered"
  | "project_created"
  | "project_status"
  | "system"

type NotificationRecord = {
  id: string
  recipientRole: string
  recipientId: string | null
  actorId: string | null
  actorName: string | null
  type: string
  title: string
  body: string
  actionUrl: string | null
  actionLabel: string | null
  entityType: string | null
  entityId: string | null
  emailEnabled: boolean
  whatsappEnabled: boolean
  emailSentAt: Date | string | null
  whatsappSentAt: Date | string | null
  readAt: Date | string | null
  archivedAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

type NotificationUser = {
  id: string
  name: string
  company?: string | null
  email?: string
}

type NotificationMessage = {
  id: string
  userId: string
  author: string
  name: string
  text: string
}

type NotificationProject = {
  id: string
  userId: string
  name: string
  type: string
  status: string
  paymentStatus: string
  value: number
  dueDate: Date | null
  user?: NotificationUser | null
}

type CreateNotificationInput = {
  recipientRole: NotificationRecipientRole
  recipientId?: string | null
  actorId?: string | null
  actorName?: string | null
  type: NotificationType
  title: string
  body: string
  actionUrl?: string | null
  actionLabel?: string | null
  entityType?: string | null
  entityId?: string | null
  emailEnabled?: boolean
  whatsappEnabled?: boolean
}

type NotificationAction = "read" | "unread" | "archive"

const notificationStoreKey = "notifications"
const usesBlobNotificationStore = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function createNotificationId() {
  return `notification-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getNotificationStore() {
  return getStore("novacore-notifications")
}

function truncateText(value: string, maxLength = 180) {
  const normalizedValue = value.replace(/\s+/g, " ").trim()

  if (normalizedValue.length <= maxLength) return normalizedValue

  return `${normalizedValue.slice(0, maxLength - 3)}...`
}

function getClientDisplayName(user?: NotificationUser | null) {
  return user?.company || user?.name || "Cliente"
}

function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

function formatDate(date: Date | null) {
  if (!date) return "sem data definida"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) return null
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

function normalizeNotification(notification: any): NotificationRecord | null {
  const id = String(notification?.id ?? "").trim()
  const recipientRole = String(notification?.recipientRole ?? "").trim()
  const type = String(notification?.type ?? "").trim()
  const title = String(notification?.title ?? "").trim()
  const body = String(notification?.body ?? "").trim()
  const createdAt = toIsoString(notification?.createdAt) ?? new Date().toISOString()
  const updatedAt = toIsoString(notification?.updatedAt) ?? createdAt

  if (!id || !recipientRole || !type || !title || !body) return null

  return {
    id,
    recipientRole,
    recipientId: notification?.recipientId ? String(notification.recipientId) : null,
    actorId: notification?.actorId ? String(notification.actorId) : null,
    actorName: notification?.actorName ? String(notification.actorName) : null,
    type,
    title,
    body,
    actionUrl: notification?.actionUrl ? String(notification.actionUrl) : null,
    actionLabel: notification?.actionLabel ? String(notification.actionLabel) : null,
    entityType: notification?.entityType ? String(notification.entityType) : null,
    entityId: notification?.entityId ? String(notification.entityId) : null,
    emailEnabled: Boolean(notification?.emailEnabled),
    whatsappEnabled: Boolean(notification?.whatsappEnabled),
    emailSentAt: toIsoString(notification?.emailSentAt),
    whatsappSentAt: toIsoString(notification?.whatsappSentAt),
    readAt: toIsoString(notification?.readAt),
    archivedAt: toIsoString(notification?.archivedAt),
    createdAt,
    updatedAt,
  }
}

function sortNotifications(notifications: NotificationRecord[]) {
  return [...notifications].sort((first, second) => {
    const firstCreatedAt = toIsoString(first.createdAt) ?? ""
    const secondCreatedAt = toIsoString(second.createdAt) ?? ""

    return secondCreatedAt.localeCompare(firstCreatedAt)
  })
}

async function readBlobNotifications() {
  const notifications = await getNotificationStore().get(notificationStoreKey, { type: "json" })

  return Array.isArray(notifications)
    ? sortNotifications(notifications.map(normalizeNotification).filter(Boolean) as NotificationRecord[])
    : []
}

async function writeBlobNotifications(notifications: NotificationRecord[]) {
  await getNotificationStore().setJSON(notificationStoreKey, sortNotifications(notifications))
}

function matchesNotificationScope(notification: NotificationRecord, audience: NotificationRecipientRole, userId?: string) {
  if (notification.archivedAt) return false
  if (audience === "admin") return notification.recipientRole === "admin"

  return notification.recipientRole === "client" && notification.recipientId === userId
}

function getNotificationWhere(audience: NotificationRecipientRole, userId?: string) {
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

export function serializeNotification(notification: NotificationRecord) {
  return {
    id: notification.id,
    recipientRole: notification.recipientRole,
    recipientId: notification.recipientId,
    actorId: notification.actorId,
    actorName: notification.actorName,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    actionUrl: notification.actionUrl,
    actionLabel: notification.actionLabel,
    entityType: notification.entityType,
    entityId: notification.entityId,
    channels: {
      panel: true,
      emailEnabled: notification.emailEnabled,
      whatsappEnabled: notification.whatsappEnabled,
      emailSentAt: toIsoString(notification.emailSentAt),
      whatsappSentAt: toIsoString(notification.whatsappSentAt),
    },
    readAt: toIsoString(notification.readAt),
    archivedAt: toIsoString(notification.archivedAt),
    createdAt: toIsoString(notification.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoString(notification.updatedAt) ?? new Date().toISOString(),
  }
}

export async function createNotification(input: CreateNotificationInput) {
  if (usesBlobNotificationStore) {
    const notifications = await readBlobNotifications()
    const now = new Date().toISOString()
    const notification: NotificationRecord = {
      id: createNotificationId(),
      recipientRole: input.recipientRole,
      recipientId: input.recipientId ?? null,
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      type: input.type,
      title: input.title,
      body: input.body,
      actionUrl: input.actionUrl ?? null,
      actionLabel: input.actionLabel ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      emailEnabled: input.emailEnabled ?? false,
      whatsappEnabled: input.whatsappEnabled ?? false,
      emailSentAt: null,
      whatsappSentAt: null,
      readAt: null,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    }

    await writeBlobNotifications([notification, ...notifications])

    return notification
  }

  return prisma.notification.create({
    data: {
      recipientRole: input.recipientRole,
      recipientId: input.recipientId ?? null,
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      type: input.type,
      title: input.title,
      body: input.body,
      actionUrl: input.actionUrl ?? null,
      actionLabel: input.actionLabel ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      emailEnabled: input.emailEnabled ?? false,
      whatsappEnabled: input.whatsappEnabled ?? false,
    },
  })
}

export async function listNotifications(input: {
  audience: NotificationRecipientRole
  userId?: string
  take?: number
}) {
  const take = Math.min(Math.max(input.take ?? 80, 1), 120)

  if (usesBlobNotificationStore) {
    const scopedNotifications = (await readBlobNotifications()).filter((notification) =>
      matchesNotificationScope(notification, input.audience, input.userId),
    )

    return {
      notifications: scopedNotifications.slice(0, take),
      unreadCount: scopedNotifications.filter((notification) => !notification.readAt).length,
      totalCount: scopedNotifications.length,
    }
  }

  const where = getNotificationWhere(input.audience, input.userId)
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

  return {
    notifications,
    unreadCount,
    totalCount,
  }
}

export async function updateNotifications(input: {
  audience: NotificationRecipientRole
  userId?: string
  action: NotificationAction
  ids?: string[]
  all?: boolean
}) {
  const ids = input.ids ?? []
  const now = new Date()

  if (usesBlobNotificationStore) {
    const nowIso = now.toISOString()
    const notifications = await readBlobNotifications()
    const updatedNotifications = notifications.map((notification) => {
      const inScope = matchesNotificationScope(notification, input.audience, input.userId)
      const selected = input.all || ids.includes(notification.id)

      if (!inScope || !selected) return notification

      if (input.action === "archive") {
        return {
          ...notification,
          readAt: nowIso,
          archivedAt: nowIso,
          updatedAt: nowIso,
        }
      }

      return {
        ...notification,
        readAt: input.action === "unread" ? null : nowIso,
        updatedAt: nowIso,
      }
    })

    await writeBlobNotifications(updatedNotifications)

    return listNotifications({
      audience: input.audience,
      userId: input.userId,
      take: 80,
    })
  }

  const scopeWhere = getNotificationWhere(input.audience, input.userId)
  const where = {
    ...scopeWhere,
    ...(input.all ? {} : { id: { in: ids } }),
  }
  const data =
    input.action === "archive"
      ? { archivedAt: now, readAt: now }
      : input.action === "unread"
        ? { readAt: null }
        : { readAt: now }

  await prisma.notification.updateMany({
    where,
    data,
  })

  return listNotifications({
    audience: input.audience,
    userId: input.userId,
    take: 80,
  })
}

export function createClientNotification(userId: string, input: Omit<CreateNotificationInput, "recipientRole" | "recipientId">) {
  return createNotification({
    ...input,
    recipientRole: "client",
    recipientId: userId,
  })
}

export function createAdminNotification(input: Omit<CreateNotificationInput, "recipientRole" | "recipientId">) {
  return createNotification({
    ...input,
    recipientRole: "admin",
    recipientId: null,
  })
}

export async function notifyMessageCreated(message: NotificationMessage, user: NotificationUser) {
  if (message.author === "client") {
    return createAdminNotification({
      actorId: user.id,
      actorName: getClientDisplayName(user),
      type: "message",
      title: `Nova mensagem de ${getClientDisplayName(user)}`,
      body: truncateText(message.text),
      actionUrl: `/admin?clientId=${user.id}`,
      actionLabel: "Abrir conversa",
      entityType: "Message",
      entityId: message.id,
    })
  }

  return createClientNotification(user.id, {
    actorName: "NovaCore AI",
    type: "message",
    title: "Nova resposta da equipe",
    body: truncateText(message.text),
    actionUrl: "/cliente?tab=contato",
    actionLabel: "Ver conversa",
    entityType: "Message",
    entityId: message.id,
  })
}

export async function notifyClientRegistered(user: NotificationUser) {
  return createAdminNotification({
    actorId: user.id,
    actorName: getClientDisplayName(user),
    type: "client_registered",
    title: "Novo cliente cadastrado",
    body: `${getClientDisplayName(user)} acabou de criar uma conta na area do cliente.`,
    actionUrl: `/admin?clientId=${user.id}`,
    actionLabel: "Ver cliente",
    entityType: "User",
    entityId: user.id,
  })
}

export async function notifyProjectCreated(project: NotificationProject) {
  const projectNotification = createClientNotification(project.userId, {
    actorName: "NovaCore AI",
    type: "project_created",
    title: "Novo projeto cadastrado",
    body: `${project.name} foi cadastrado com entrega prevista para ${formatDate(project.dueDate)}.`,
    actionUrl: "/cliente?tab=produtos",
    actionLabel: "Ver projeto",
    entityType: "Project",
    entityId: project.id,
  })

  if (project.value <= 0 || project.paymentStatus !== "Pendente") {
    return projectNotification
  }

  return Promise.all([
    projectNotification,
    createClientNotification(project.userId, {
      actorName: "NovaCore AI",
      type: "payment_due",
      title: "Pagamento pendente",
      body: `${project.name} tem pagamento em aberto no valor de ${formatMoney(project.value)}.`,
      actionUrl: "/cliente?tab=pagamento",
      actionLabel: "Ver pagamento",
      entityType: "Project",
      entityId: project.id,
    }),
  ])
}

export async function notifyProjectStatusChanged(project: NotificationProject, previousStatus: string) {
  if (previousStatus === project.status) return null

  return createClientNotification(project.userId, {
    actorName: "NovaCore AI",
    type: "project_status",
    title: "Progresso do projeto atualizado",
    body: `${project.name} mudou de ${previousStatus} para ${project.status}.`,
    actionUrl: "/cliente?tab=produtos",
    actionLabel: "Ver progresso",
    entityType: "Project",
    entityId: project.id,
  })
}

export async function notifyPaymentStatusChanged(project: NotificationProject, previousStatus: string) {
  if (previousStatus === project.paymentStatus) return null

  const clientName = getClientDisplayName(project.user)

  if (project.paymentStatus === "Pago") {
    return Promise.all([
      createClientNotification(project.userId, {
        actorName: "NovaCore AI",
        type: "payment_paid",
        title: "Pagamento confirmado",
        body: `Recebemos o pagamento de ${project.name} no valor de ${formatMoney(project.value)}.`,
        actionUrl: "/cliente?tab=pagamento",
        actionLabel: "Ver pagamento",
        entityType: "Project",
        entityId: project.id,
      }),
      createAdminNotification({
        actorId: project.userId,
        actorName: clientName,
        type: "payment_paid",
        title: "Pagamento recebido",
        body: `${clientName} pagou ${project.name} no valor de ${formatMoney(project.value)}.`,
        actionUrl: `/admin?clientId=${project.userId}`,
        actionLabel: "Ver cliente",
        entityType: "Project",
        entityId: project.id,
      }),
    ])
  }

  if (project.paymentStatus === "Pendente") {
    return createClientNotification(project.userId, {
      actorName: "NovaCore AI",
      type: "payment_due",
      title: "Pagamento pendente",
      body: `${project.name} tem pagamento em aberto no valor de ${formatMoney(project.value)}.`,
      actionUrl: "/cliente?tab=pagamento",
      actionLabel: "Ver pagamento",
      entityType: "Project",
      entityId: project.id,
    })
  }

  return Promise.all([
    createClientNotification(project.userId, {
      actorName: "NovaCore AI",
      type: "payment_status",
      title: "Status do pagamento atualizado",
      body: `${project.name} mudou de ${previousStatus} para ${project.paymentStatus}.`,
      actionUrl: "/cliente?tab=pagamento",
      actionLabel: "Ver pagamento",
      entityType: "Project",
      entityId: project.id,
    }),
    createAdminNotification({
      actorId: project.userId,
      actorName: clientName,
      type: "payment_status",
      title: "Status de pagamento atualizado",
      body: `${project.name}, de ${clientName}, mudou de ${previousStatus} para ${project.paymentStatus}.`,
      actionUrl: `/admin?clientId=${project.userId}`,
      actionLabel: "Ver cliente",
      entityType: "Project",
      entityId: project.id,
    }),
  ])
}
