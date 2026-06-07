export type ChatMessage = {
  id: string
  author: "team" | "client"
  name: string
  text: string
  time: string
  attachments?: ChatAttachment[]
}

export type ChatAttachment = {
  id: string
  name: string
  size: number
  type: string
  dataUrl?: string
}

export type ApiMessage = {
  id: string
  userId: string
  author: "client" | "admin"
  name: string
  text: string
  attachments?: ChatAttachment[]
  createdAt: string
}

export type PaymentProject = {
  id: string
  name: string
  type: string
  status: string
  paymentStatus: string
  value: number
  dueDate: string
  abacateCheckoutUrl?: string | null
}

export type NotificationItem = {
  id: string
  recipientRole: "client" | "admin"
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
  channels: {
    panel: boolean
    emailEnabled: boolean
    whatsappEnabled: boolean
    emailSentAt: string | null
    whatsappSentAt: string | null
  }
  readAt: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export type NotificationsPayload = {
  notifications?: NotificationItem[]
  unreadCount?: number
  totalCount?: number
}
