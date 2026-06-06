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
  emailSentAt: Date | null
  whatsappSentAt: Date | null
  readAt: Date | null
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
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

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

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
      emailSentAt: notification.emailSentAt?.toISOString() ?? null,
      whatsappSentAt: notification.whatsappSentAt?.toISOString() ?? null,
    },
    readAt: notification.readAt?.toISOString() ?? null,
    archivedAt: notification.archivedAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt.toISOString(),
  }
}

export async function createNotification(input: CreateNotificationInput) {
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
