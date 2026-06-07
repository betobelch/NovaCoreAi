"use client"

import { FormEvent, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Bell,
  Bot,
  CheckCheck,
  ChevronDown,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react"
import { clearClientAuth, ClientAuthUser, getClientAuth, updateClientAuth } from "@/lib/client-auth"
import type { PurchaseProduct } from "@/lib/product-catalog"
import { formatCpf, formatPhone } from "@/lib/registration-validation"
import { ThemeToggle } from "@/components/theme-toggle"
import styles from "./cliente.module.css"

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "contato", label: "Contato", icon: MessageCircle },
  { id: "produtos", label: "Produtos", icon: FileText },
  { id: "pagamento", label: "Pagamento", icon: CreditCard },
] as const

type ClientTabId = (typeof tabs)[number]["id"]

type ChatMessage = {
  id: string
  author: "team" | "client"
  name: string
  text: string
  time: string
  attachments?: ChatAttachment[]
}

type ChatAttachment = {
  id: string
  name: string
  size: number
  type: string
  dataUrl?: string
}

type ApiMessage = {
  id: string
  userId: string
  author: "client" | "admin"
  name: string
  text: string
  attachments?: ChatAttachment[]
  createdAt: string
}

type PaymentProject = {
  id: string
  name: string
  type: string
  status: string
  paymentStatus: string
  value: number
  dueDate: string
  abacateCheckoutUrl?: string | null
}

type NotificationItem = {
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

type NotificationsPayload = {
  notifications?: NotificationItem[]
  unreadCount?: number
  totalCount?: number
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

function formatDate(date: string) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`))
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

function formatNotificationTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

function getNotificationTypeLabel(type: string) {
  if (type === "message") return "Mensagem"
  if (type === "payment_due") return "Pagamento"
  if (type === "payment_paid") return "Pagamento"
  if (type === "payment_status") return "Pagamento"
  if (type === "project_created") return "Projeto"
  if (type === "project_status") return "Progresso"
  return "Aviso"
}

function getClientTabFromActionUrl(actionUrl: string | null): ClientTabId | null {
  if (!actionUrl) return null

  try {
    const tabId = new URL(actionUrl, window.location.origin).searchParams.get("tab")

    if (tabs.some((tab) => tab.id === tabId)) {
      return tabId as ClientTabId
    }
  } catch {
    return null
  }

  return null
}

function mapApiMessageToClient(message: ApiMessage): ChatMessage {
  return {
    id: message.id,
    author: message.author === "admin" ? "team" : "client",
    name: message.author === "admin" ? message.name : "Voce",
    text: message.text,
    attachments: message.attachments ?? [],
    time: formatMessageTime(message.createdAt),
  }
}

function createClientMessage(text: string, attachments: ChatAttachment[] = []): ChatMessage {
  return {
    id: String(Date.now()),
    author: "client",
    name: "Voce",
    text,
    time: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
    attachments,
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function createAttachments(files: FileList) {
  return Promise.all(Array.from(files).map(async (file) => ({
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type || "Arquivo",
    dataUrl: await readFileAsDataUrl(file),
  })))
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function isImageAttachment(attachment: ChatAttachment) {
  return attachment.type.toLowerCase().startsWith("image/") || Boolean(attachment.dataUrl?.startsWith("data:image/"))
}

function getInitials(name?: string) {
  if (!name) return "CL"

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function getMaskedCpf(cpf?: string) {
  if (!cpf) return "Nao informado"

  return "***.***.***-**"
}

export default function ClientePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ClientTabId>("perfil")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [purchaseProducts, setPurchaseProducts] = useState<PurchaseProduct[]>([])
  const [clientProjects, setClientProjects] = useState<PaymentProject[]>([])
  const [paymentProjects, setPaymentProjects] = useState<PaymentProject[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [clientUser, setClientUser] = useState<ClientAuthUser | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const [autoOpenedMenuUserId, setAutoOpenedMenuUserId] = useState("")

  useEffect(() => {
    const savedUser = getClientAuth()

    if (!savedUser) {
      router.replace("/login")
      return
    }

    setClientUser(savedUser)
  }, [router])

  useEffect(() => {
    if (!clientUser || clientUser.role === "admin") return

    let isMounted = true
    const currentUserId = clientUser.id

    async function loadProfile() {
      try {
        const response = await fetch(`/api/client/profile?userId=${encodeURIComponent(currentUserId)}`, {
          cache: "no-store",
        })

        if (!response.ok) return

        const payload = (await response.json()) as { user?: ClientAuthUser }

        if (payload.user && isMounted) {
          setClientUser(payload.user)
          updateClientAuth(payload.user)
        }
      } catch {
        return
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [clientUser?.id, clientUser?.role])

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" })

        if (!response.ok) return

        const payload = (await response.json()) as { products?: PurchaseProduct[] }

        if (payload.products) {
          setPurchaseProducts(payload.products)
        }
      } catch {
          setPurchaseProducts([])
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (!clientUser) return

    let isMounted = true
    const currentUser = clientUser

    async function loadMessages() {
      try {
        const response = await fetch(`/api/messages?userId=${encodeURIComponent(currentUser.id)}`, { cache: "no-store" })

        if (!response.ok) return

        const payload = (await response.json()) as { messages?: ApiMessage[] }
        const nextMessages = payload.messages?.map(mapApiMessageToClient) ?? []

        if (isMounted) {
          setMessages(nextMessages)
        }
      } catch {
        if (isMounted) {
          setMessages((currentMessages) => currentMessages)
        }
      }
    }

    loadMessages()
    const refreshId = window.setInterval(loadMessages, 5000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [clientUser])

  useEffect(() => {
    if (!clientUser) return

    let isMounted = true
    const currentUserId = clientUser.id

    async function loadClientProjects() {
      try {
        const response = await fetch(`/api/projects?userId=${encodeURIComponent(currentUserId)}`, {
          cache: "no-store",
        })

        if (!response.ok) return

        const payload = (await response.json()) as { projects?: PaymentProject[] }

        if (isMounted) {
          setClientProjects(payload.projects ?? [])
        }
      } catch {
        if (isMounted) {
          setClientProjects([])
        }
      }
    }

    loadClientProjects()
    const refreshId = window.setInterval(loadClientProjects, 8000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [clientUser?.id])

  useEffect(() => {
    if (!clientUser) return

    let isMounted = true
    const currentUserId = clientUser.id

    async function loadPaymentProjects() {
      try {
        const response = await fetch(
          `/api/projects?userId=${encodeURIComponent(currentUserId)}&openForPayment=1`,
          { cache: "no-store" },
        )

        if (!response.ok) return

        const payload = (await response.json()) as { projects?: PaymentProject[] }

        if (isMounted) {
          setPaymentProjects(payload.projects ?? [])
        }
      } catch {
        if (isMounted) {
          setPaymentProjects([])
        }
      }
    }

    loadPaymentProjects()
    const refreshId = window.setInterval(loadPaymentProjects, 8000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [clientUser?.id])

  useEffect(() => {
    if (!clientUser || clientUser.role === "admin") return

    let isMounted = true
    const currentUserId = clientUser.id

    async function loadNotifications() {
      try {
        const response = await fetch(
          `/api/notifications?audience=client&userId=${encodeURIComponent(currentUserId)}`,
          { cache: "no-store" },
        )

        if (!response.ok) return

        const payload = (await response.json()) as NotificationsPayload

        if (isMounted) {
          setNotifications(payload.notifications ?? [])
          setUnreadNotifications(payload.unreadCount ?? 0)
        }
      } catch {
        if (isMounted) {
          setNotifications((currentNotifications) => currentNotifications)
        }
      }
    }

    loadNotifications()
    const refreshId = window.setInterval(loadNotifications, 5000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [clientUser?.id, clientUser?.role])

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab")

    if (tabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab as ClientTabId)
    }
  }, [])

  useEffect(() => {
    if (!clientUser || clientUser.role === "admin") return
    if (unreadNotifications <= 0 || autoOpenedMenuUserId === clientUser.id) return

    setIsNotificationMenuOpen(true)
    setAutoOpenedMenuUserId(clientUser.id)
  }, [autoOpenedMenuUserId, clientUser, unreadNotifications])

  function handleLogout() {
    clearClientAuth()
    router.replace("/login")
  }

  function handleClientUserUpdate(user: ClientAuthUser) {
    setClientUser(user)
    updateClientAuth(user)
  }

  function applyNotificationsPayload(payload: NotificationsPayload) {
    setNotifications(payload.notifications ?? [])
    setUnreadNotifications(payload.unreadCount ?? 0)
  }

  async function markClientNotificationsAsRead(ids?: string[]) {
    if (!clientUser || clientUser.role === "admin") return

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "client",
          userId: clientUser.id,
          action: "read",
          all: !ids,
          ids,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as NotificationsPayload
      applyNotificationsPayload(payload)
    } catch {
      return
    }
  }

  function handleNotificationAction(notification: NotificationItem) {
    markClientNotificationsAsRead([notification.id])
    setIsNotificationMenuOpen(false)
    setIsUserMenuOpen(false)

    const targetTab = getClientTabFromActionUrl(notification.actionUrl)

    if (targetTab) {
      setActiveTab(targetTab)
    }
  }

  async function sendClientMessage(text: string, attachments: ChatAttachment[] = []) {
    if (!clientUser) return

    const optimisticMessage = createClientMessage(text, attachments)

    setMessages((currentMessages) => [...currentMessages, optimisticMessage])

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clientUser.id,
          author: "client",
          text,
          clientName: clientUser.name,
          clientCompany: clientUser.company,
          clientEmail: clientUser.email,
          clientCpf: clientUser.cpf,
          attachments,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as { message?: ApiMessage }

      if (payload.message) {
        const savedMessage = mapApiMessageToClient(payload.message)
        setMessages((currentMessages) =>
          currentMessages.map((message) => (message.id === optimisticMessage.id ? savedMessage : message)),
        )
      }
    } catch {
      return
    }
  }

  function handleAiPurchaseRequest(productName: string) {
    sendClientMessage(
      `Quero solicitar a compra de ${productName}. Podem me passar valores, prazo e proximos passos?`,
    )
    setActiveTab("contato")
  }

  function handlePagePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()

    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`)
  }

  return (
    <main className={styles.clientPage} onPointerMove={handlePagePointerMove}>
      <ClientNavbar
        clientName={clientUser?.name}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        isUserMenuOpen={isUserMenuOpen}
        isNotificationMenuOpen={isNotificationMenuOpen}
        onToggleUserMenu={() => {
          setIsUserMenuOpen((current) => !current)
          setIsNotificationMenuOpen(false)
        }}
        onToggleNotificationMenu={() => {
          setIsNotificationMenuOpen((current) => !current)
          setIsUserMenuOpen(false)
        }}
        onCloseUserMenu={() => setIsUserMenuOpen(false)}
        onOpenPanel={() => {
          setActiveTab("perfil")
          setIsUserMenuOpen(false)
          setIsNotificationMenuOpen(false)
        }}
        onOpenNotification={handleNotificationAction}
        onMarkAllNotificationsRead={() => markClientNotificationsAsRead()}
        onLogout={handleLogout}
      />
      <section className={styles.clientSection}>
        <div className={styles.pageGlow} />
        <div className={styles.shell}>
          <div className={styles.hero}>
            <div>
              <span className={styles.eyebrow}>NovaCore AI Client OS</span>
              <h1 className={styles.title}>
                {clientUser ? `Central premium de ${clientUser.name}` : "Controle seus produtos com a NovaCore AI"}
              </h1>
              <p className={styles.subtitle}>
                Projetos, conversa direta, pagamentos e contexto operacional reunidos em um painel de I.A elegante,
                rapido e cinematografico.
              </p>
            </div>
            <div className={styles.heroSignal} aria-hidden="true">
              <span className={styles.heroSignalPing} />
              <div>
                <strong>AI Workspace</strong>
                <span>Atendimento online</span>
              </div>
            </div>
          </div>

          <div id="painel" className={styles.dashboard}>
            <aside className={styles.sidebar}>
              <div className={styles.sidebarProfile}>
                <div className={styles.sidebarAvatar}>{getInitials(clientUser?.name)}</div>
                <div>
                  <strong>{clientUser?.name ?? "Cliente"}</strong>
                  <span>{clientUser?.company || "NovaCore AI"}</span>
                </div>
              </div>
              <div className={styles.tabList}>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                    >
                      <Icon className={styles.tabIcon} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <div className={styles.panel}>
              {activeTab === "perfil" && (
                <ProfileTab
                  clientUser={clientUser}
                  messages={messages}
                  clientProjects={clientProjects}
                  paymentProjects={paymentProjects}
                  onClientUserUpdate={handleClientUserUpdate}
                />
              )}
              {activeTab === "contato" && <ContactTab messages={messages} onSendMessage={sendClientMessage} />}
              {activeTab === "produtos" && (
                <ProductsTab
                  products={purchaseProducts}
                  projects={clientProjects}
                  onAiPurchaseRequest={handleAiPurchaseRequest}
                />
              )}
              {activeTab === "pagamento" && <PaymentTab clientUser={clientUser} projects={paymentProjects} />}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

type ClientNavbarProps = {
  clientName?: string
  notifications: NotificationItem[]
  unreadNotifications: number
  isUserMenuOpen: boolean
  isNotificationMenuOpen: boolean
  onToggleUserMenu: () => void
  onToggleNotificationMenu: () => void
  onCloseUserMenu: () => void
  onOpenPanel: () => void
  onOpenNotification: (notification: NotificationItem) => void
  onMarkAllNotificationsRead: () => void
  onLogout: () => void
}

function ClientNavbar({
  clientName,
  notifications,
  unreadNotifications,
  isUserMenuOpen,
  isNotificationMenuOpen,
  onToggleUserMenu,
  onToggleNotificationMenu,
  onCloseUserMenu,
  onOpenPanel,
  onOpenNotification,
  onMarkAllNotificationsRead,
  onLogout,
}: ClientNavbarProps) {
  return (
    <header className={styles.clientNavbar}>
      <div className={styles.clientNavInner}>
        <Link href="/" className={styles.clientBrand}>
          <span className={styles.clientBrandIcon}>
            <Sparkles className={styles.clientBrandSvg} />
          </span>
          <span className={styles.clientBrandText}>
            NovaCore<span>AI</span>
          </span>
        </Link>

        <nav className={styles.clientNavLinks} aria-label="Navegacao da area do cliente">
          <Link href="/#home">
            <Home className={styles.navIcon} />
            Home
          </Link>
          <a href="#painel">
            <LayoutDashboard className={styles.navIcon} />
            Painel
          </a>
        </nav>

        <div className={styles.clientNavActions}>
          <Link href="/" className={styles.clientSiteLink}>
            <span>Voltar ao site</span>
            <ArrowRight className={styles.smallIcon} />
          </Link>
          <ClientNotificationMenu
            notifications={notifications}
            unreadCount={unreadNotifications}
            isOpen={isNotificationMenuOpen}
            onToggle={onToggleNotificationMenu}
            onOpenNotification={onOpenNotification}
            onMarkAllRead={onMarkAllNotificationsRead}
          />
          <ClientUserMenu
            clientName={clientName}
            isOpen={isUserMenuOpen}
            onToggle={onToggleUserMenu}
            onClose={onCloseUserMenu}
            onOpenPanel={onOpenPanel}
            onLogout={onLogout}
          />
          <ThemeToggle className={styles.themeToggle} />
        </div>
      </div>
    </header>
  )
}

type ContactTabProps = {
  messages: ChatMessage[]
  onSendMessage: (text: string, attachments?: ChatAttachment[]) => Promise<void>
}

type ProfileTabProps = {
  clientUser: ClientAuthUser | null
  messages: ChatMessage[]
  clientProjects: PaymentProject[]
  paymentProjects: PaymentProject[]
  onClientUserUpdate: (user: ClientAuthUser) => void
}

type ClientUserMenuProps = {
  clientName?: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onOpenPanel: () => void
  onLogout: () => void
}

type ClientNotificationMenuProps = {
  notifications: NotificationItem[]
  unreadCount: number
  isOpen: boolean
  onToggle: () => void
  onOpenNotification: (notification: NotificationItem) => void
  onMarkAllRead: () => void
}

function NotificationTypeIcon({ type }: { type: string }) {
  if (type === "message") return <MessageCircle className={styles.userMenuNotificationSvg} />
  if (type.startsWith("payment")) return <CreditCard className={styles.userMenuNotificationSvg} />
  if (type === "client_registered") return <User className={styles.userMenuNotificationSvg} />
  if (type.startsWith("project")) return <FileText className={styles.userMenuNotificationSvg} />

  return <Bell className={styles.userMenuNotificationSvg} />
}

function getNotificationToneClass(type: string) {
  if (type === "message") return styles.userMenuNotificationMessage
  if (type === "payment_due") return styles.userMenuNotificationWarning
  if (type === "payment_paid") return styles.userMenuNotificationSuccess
  if (type.startsWith("payment")) return styles.userMenuNotificationDanger
  if (type === "client_registered") return styles.userMenuNotificationProject
  if (type.startsWith("project")) return styles.userMenuNotificationProject

  return styles.userMenuNotificationDefault
}

function ClientNotificationMenu({
  notifications,
  unreadCount,
  isOpen,
  onToggle,
  onOpenNotification,
  onMarkAllRead,
}: ClientNotificationMenuProps) {
  const visibleNotifications = notifications.slice(0, 4)

  return (
    <div className={styles.clientNotificationMenu}>
      <button
        type="button"
        className={`${styles.notificationNavbarButton} ${unreadCount > 0 ? styles.notificationNavbarButtonAlert : ""}`}
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Abrir notificacoes"
        title="Notificacoes"
      >
        <Bell className={styles.smallIcon} />
        {unreadCount > 0 && <span className={styles.notificationCount}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.userMenuPanel} role="menu">
          <div className={styles.userMenuNotifications}>
            <div className={styles.userMenuNotificationsHeader}>
              <span>Atualizacoes</span>
              {unreadCount > 0 && (
                <button type="button" onClick={onMarkAllRead}>
                  <CheckCheck className={styles.smallIcon} />
                  Marcar
                </button>
              )}
            </div>

            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`${styles.userMenuNotification} ${!notification.readAt ? styles.userMenuNotificationUnread : ""}`}
                  onClick={() => onOpenNotification(notification)}
                >
                  <span className={`${styles.userMenuNotificationIcon} ${getNotificationToneClass(notification.type)}`}>
                    <NotificationTypeIcon type={notification.type} />
                  </span>
                  <span className={styles.userMenuNotificationText}>
                    <strong>{notification.title}</strong>
                    <span>{notification.body}</span>
                    <small>{formatNotificationTime(notification.createdAt)}</small>
                  </span>
                </button>
              ))
            ) : (
              <p className={styles.userMenuEmpty}>Nenhuma atualizacao nova.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ClientUserMenu({
  clientName,
  isOpen,
  onToggle,
  onClose,
  onOpenPanel,
  onLogout,
}: ClientUserMenuProps) {
  return (
    <div className={styles.clientUserMenu}>
      <button
        type="button"
        className={styles.userMenuTrigger}
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <User className={styles.smallIcon} />
        <span>{clientName ?? "Cliente"}</span>
        <ChevronDown className={`${styles.smallIcon} ${isOpen ? styles.userMenuChevronOpen : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.userMenuPanel} role="menu">
          <button type="button" className={styles.userMenuLink} onClick={onOpenPanel} role="menuitem">
            <LayoutDashboard className={styles.smallIcon} />
            Area do Cliente
          </button>

          <button
            type="button"
            className={`${styles.userMenuLink} ${styles.userMenuLogout}`}
            onClick={() => {
              onClose()
              onLogout()
            }}
            role="menuitem"
          >
            <LogOut className={styles.smallIcon} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileTab({
  clientUser,
  messages,
  clientProjects,
  paymentProjects,
  onClientUserUpdate,
}: ProfileTabProps) {
  const [showCpf, setShowCpf] = useState(false)
  const [phoneDraft, setPhoneDraft] = useState(() => formatPhone(clientUser?.phone ?? ""))
  const [isSavingPhone, setIsSavingPhone] = useState(false)
  const [phoneStatus, setPhoneStatus] = useState<null | { type: "success" | "error"; message: string }>(null)
  const pendingPaymentValue = paymentProjects.reduce((total, project) => total + project.value, 0)
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
  const latestProject = clientProjects[0] ?? null
  const accountFields = [
    { label: "Nome", value: clientUser?.name ?? "Cliente" },
    { label: "Empresa", value: clientUser?.company || "Nao informada" },
    { label: "E-mail", value: clientUser?.email ?? "Nao informado" },
  ]

  useEffect(() => {
    setPhoneDraft(formatPhone(clientUser?.phone ?? ""))
  }, [clientUser?.phone])

  async function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!clientUser) return

    setIsSavingPhone(true)
    setPhoneStatus(null)

    try {
      const response = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clientUser.id,
          phone: phoneDraft,
        }),
      })
      const payload = (await response.json()) as { user?: ClientAuthUser; message?: string }

      if (!response.ok || !payload.user) {
        setPhoneStatus({ type: "error", message: payload.message ?? "Nao foi possivel salvar o telefone." })
        return
      }

      onClientUserUpdate(payload.user)
      setPhoneStatus({ type: "success", message: "Telefone atualizado." })
    } catch {
      setPhoneStatus({ type: "error", message: "Nao foi possivel conectar agora." })
    } finally {
      setIsSavingPhone(false)
    }
  }

  return (
    <div className={styles.profileTab}>
      <div className={styles.profileHeader}>
        <div className={styles.profileIdentity}>
          <div className={styles.profileAvatar}>{getInitials(clientUser?.name)}</div>
          <div>
            <span className={styles.eyebrow}>Resumo do perfil</span>
            <h2 className={styles.sectionTitle}>{clientUser?.name ?? "Cliente NovaCore AI"}</h2>
            <p className={styles.sectionIntro}>
              Informacoes do cadastro, comunicacao e pendencias reunidas em um painel simples.
            </p>
          </div>
        </div>
        <span className={styles.profileStatus}>Cadastro ativo</span>
      </div>

      <div className={styles.profileSummaryGrid}>
        <div className={styles.profileMetric}>
          <MessageCircle className={styles.profileMetricIcon} />
          <span>Mensagens</span>
          <strong>{messages.length}</strong>
        </div>
        <div className={styles.profileMetric}>
          <FileText className={styles.profileMetricIcon} />
          <span>Projetos</span>
          <strong>{clientProjects.length}</strong>
        </div>
        <div className={styles.profileMetric}>
          <CreditCard className={styles.profileMetricIcon} />
          <span>A pagar</span>
          <strong>{paymentProjects.length}</strong>
        </div>
        <div className={`${styles.profileMetric} ${styles.profileMetricWarning}`}>
          <CreditCard className={styles.profileMetricIcon} />
          <span>Valor pendente</span>
          <strong>{formatMoney(pendingPaymentValue)}</strong>
        </div>
      </div>

      <div className={styles.profileContentGrid}>
        <section className={styles.profileCard}>
          <h3>Dados do cliente</h3>
          <div className={styles.profileFieldList}>
            {accountFields.map((field) => (
              <div key={field.label} className={styles.profileField}>
                <span>{field.label}</span>
                <strong>{field.value}</strong>
              </div>
            ))}
            <div className={styles.profileField}>
              <span>CPF</span>
              <div className={styles.profileSensitiveField}>
                <strong>{showCpf ? formatCpf(clientUser?.cpf ?? "") || "Nao informado" : getMaskedCpf(clientUser?.cpf)}</strong>
                {clientUser?.cpf && (
                  <button
                    type="button"
                    onClick={() => setShowCpf((current) => !current)}
                    className={styles.profileIconButton}
                    aria-label={showCpf ? "Ocultar CPF" : "Mostrar CPF"}
                    title={showCpf ? "Ocultar CPF" : "Mostrar CPF"}
                  >
                    {showCpf ? <EyeOff className={styles.smallIcon} /> : <Eye className={styles.smallIcon} />}
                  </button>
                )}
              </div>
            </div>
            <form className={styles.profilePhoneForm} onSubmit={handlePhoneSubmit}>
              <label htmlFor="profile-phone">
                <span>Telefone</span>
                <input
                  id="profile-phone"
                  value={phoneDraft}
                  onChange={(event) => {
                    setPhoneDraft(formatPhone(event.target.value))
                    setPhoneStatus(null)
                  }}
                  inputMode="tel"
                  maxLength={15}
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                />
              </label>
              <button type="submit" disabled={isSavingPhone}>
                {isSavingPhone ? "Salvando..." : "Salvar telefone"}
              </button>
              {phoneStatus && (
                <p className={phoneStatus.type === "success" ? styles.profileSuccess : styles.profileError}>
                  {phoneStatus.message}
                </p>
              )}
            </form>
          </div>
        </section>

        <section className={styles.profileCard}>
          <h3>Resumo rapido</h3>
          <div className={styles.profileTimeline}>
            <div>
              <span>Ultima conversa</span>
              <strong>{lastMessage ? `${lastMessage.name} - ${lastMessage.time}` : "Nenhuma mensagem registrada"}</strong>
              <p>{lastMessage?.text ?? "Quando iniciar uma conversa, o historico aparece aqui."}</p>
            </div>
            <div>
              <span>Projeto recente</span>
              <strong>{latestProject ? latestProject.name : "Nenhum projeto cadastrado"}</strong>
              <p>
                {latestProject
                  ? `${latestProject.status} - ${
                      latestProject.value > 0 ? formatMoney(latestProject.value) : "sem cobranca"
                    }`
                  : "Quando a equipe cadastrar um projeto, ele aparece na aba Produtos."}
              </p>
            </div>
            <div>
              <span>Pagamento</span>
              <strong>
                {paymentProjects.length > 0
                  ? `${paymentProjects.length} projeto(s) pendente(s)`
                  : "Nenhuma pendencia aberta"}
              </strong>
              <p>
                {paymentProjects.length > 0
                  ? `Total atual: ${formatMoney(pendingPaymentValue)}`
                  : "Projetos pagos ou sem valor em aberto nao aparecem nesta lista."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function ContactTab({ messages, onSendMessage }: ContactTabProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const messageListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const messageList = messageListRef.current

      if (!messageList) return

      messageList.scrollTop = messageList.scrollHeight
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [messages])

  async function submitContactMessage() {
    const trimmedMessage = message.trim()

    if (!trimmedMessage && attachments.length === 0) return

    await onSendMessage(trimmedMessage || "Arquivo enviado.", attachments)
    setMessage("")
    setAttachments([])
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitContactMessage()
  }

  function handleMessageKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return

    event.preventDefault()
    void submitContactMessage()
  }

  async function handleAttachmentChange(files: FileList | null) {
    if (!files?.length) return
    const nextAttachments = await createAttachments(files)
    setAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments])
  }

  function removeAttachment(attachmentId: string) {
    setAttachments((currentAttachments) => currentAttachments.filter((attachment) => attachment.id !== attachmentId))
  }

  return (
    <div className={styles.chatLayout}>
      <div className={styles.chatPanel}>
        <div className={styles.chatHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Suporte</h2>
            <p className={styles.sectionIntro}>
              Troque mensagens sobre produto, suporte e pagamento direto nesta pagina.
            </p>
          </div>
          <span className={styles.onlineBadge}>Atendimento online</span>
        </div>

        <div className={styles.messageList} ref={messageListRef}>
          {messages.length > 0 ? (
            messages.map((item) => (
              <div
                key={item.id}
                className={`${styles.messageRow} ${item.author === "client" ? styles.messageRowClient : ""}`}
              >
                <div className={`${styles.messageBubble} ${item.author === "client" ? styles.messageBubbleClient : ""}`}>
                  <div className={styles.messageMeta}>
                    <span>{item.name}</span>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.text}</p>
                  {item.attachments && item.attachments.length > 0 && (
                    <div className={styles.messageAttachments}>
                      {item.attachments.map((attachment) =>
                        attachment.dataUrl && isImageAttachment(attachment) ? (
                          <a
                            key={attachment.id}
                            className={styles.messageImageAttachment}
                            href={attachment.dataUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir ${attachment.name}`}
                          >
                            <img className={styles.messageImagePreview} src={attachment.dataUrl} alt={attachment.name} />
                            <span className={styles.messageImageMeta}>
                              <span>{attachment.name}</span>
                              <small>{formatFileSize(attachment.size)}</small>
                            </span>
                          </a>
                        ) : attachment.dataUrl ? (
                          <a
                            key={attachment.id}
                            className={styles.messageAttachment}
                            href={attachment.dataUrl}
                            download={attachment.name}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FileText className={styles.smallIcon} />
                            <span>{attachment.name}</span>
                            <small>{formatFileSize(attachment.size)}</small>
                          </a>
                        ) : (
                          <div key={attachment.id} className={styles.messageAttachment}>
                            <FileText className={styles.smallIcon} />
                            <span>{attachment.name}</span>
                            <small>{formatFileSize(attachment.size)}</small>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>Nenhuma mensagem registrada.</div>
          )}
        </div>

        <form className={styles.chatComposer} onSubmit={handleContactSubmit}>
          {attachments.length > 0 && (
            <div className={styles.attachmentPreview}>
              {attachments.map((attachment) =>
                attachment.dataUrl && isImageAttachment(attachment) ? (
                  <div key={attachment.id} className={styles.attachmentImagePreview}>
                    <img src={attachment.dataUrl} alt={attachment.name} />
                    <div className={styles.attachmentImageInfo}>
                      <span>{attachment.name}</span>
                      <small>{formatFileSize(attachment.size)}</small>
                    </div>
                    <button type="button" onClick={() => removeAttachment(attachment.id)} aria-label={`Remover ${attachment.name}`}>
                      <X className={styles.smallIcon} />
                    </button>
                  </div>
                ) : (
                  <div key={attachment.id} className={styles.attachmentChip}>
                    <FileText className={styles.smallIcon} />
                    <span>{attachment.name}</span>
                    <small>{formatFileSize(attachment.size)}</small>
                    <button type="button" onClick={() => removeAttachment(attachment.id)} aria-label={`Remover ${attachment.name}`}>
                      <X className={styles.smallIcon} />
                    </button>
                  </div>
                ),
              )}
            </div>
          )}
          <div className={styles.composerRow}>
            <label className={styles.attachButton} aria-label="Anexar arquivos">
              <Paperclip className={styles.smallIcon} />
              <input
                type="file"
                multiple
                className={styles.fileInput}
                onChange={(event) => {
                  handleAttachmentChange(event.target.files)
                  event.target.value = ""
                }}
              />
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleMessageKeyDown}
              className={styles.chatInput}
              rows={2}
              placeholder="Digite sua mensagem para a NovaCore AI..."
            />
            <button type="submit" className={styles.sendButton} aria-label="Enviar mensagem">
              <Send className={styles.smallIcon} />
            </button>
          </div>
        </form>
      </div>

      <div className={styles.chatSidebar}>
        <div className={styles.quickTopics}>
          <h3 className={styles.cardTitle}>Assuntos rapidos</h3>
          <button type="button" onClick={() => setMessage("Quero falar sobre o andamento do meu produto.")}>
            Andamento do produto
          </button>
          <button type="button" onClick={() => setMessage("Tenho uma duvida sobre pagamento.")}>
            Pagamento
          </button>
          <button type="button" onClick={() => setMessage("Preciso solicitar uma alteracao no produto.")}>
            Solicitar alteracao
          </button>
        </div>
      </div>
    </div>
  )
}

type ProductsTabProps = {
  products: PurchaseProduct[]
  projects: PaymentProject[]
  onAiPurchaseRequest: (productName: string) => void
}

function ProductsTab({ products, projects, onAiPurchaseRequest }: ProductsTabProps) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Produtos e projetos</h2>
      <p className={styles.sectionIntro}>
        Acompanhe os projetos cadastrados pela equipe e solicite novos produtos com I.A quando precisar.
      </p>

      <div className={styles.aiPurchaseSection}>
        <div>
          <span className={styles.eyebrow}>Comprar I.A</span>
          <h3 className={styles.purchaseTitle}>Solicitar novo produto com I.A</h3>
          <p className={styles.cardMeta}>
            Escolha uma opcao para abrir uma solicitacao direta com nossa equipe dentro da conversa.
          </p>
        </div>

        <div className={styles.aiPurchaseGrid}>
          {products.length > 0 ? (
            products.map((option) => (
              <div key={option.id} className={styles.aiPurchaseCard}>
                <div className={styles.iconBox}>
                  <Bot className={styles.infoIcon} />
                </div>
                <h4 className={styles.cardTitle}>{option.name}</h4>
                <p className={styles.cardMeta}>{option.description}</p>
                <span className={styles.purchaseModel}>{option.model}</span>
                <button
                  type="button"
                  onClick={() => onAiPurchaseRequest(option.name)}
                  className={styles.purchaseButton}
                >
                  <MessageCircle className={styles.smallIcon} />
                  Solicitar compra
                </button>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>Nenhum produto cadastrado no banco.</div>
          )}
        </div>
      </div>

      <div className={styles.clientProjectsSection}>
        <div className={styles.clientProjectsHeader}>
          <div>
            <span className={styles.eyebrow}>Meus projetos</span>
            <h3 className={styles.purchaseTitle}>Projetos cadastrados</h3>
            <p className={styles.cardMeta}>
              Projetos com valor zerado tambem aparecem aqui e ficam marcados como sem cobranca.
            </p>
          </div>
          <span className={styles.projectCountBadge}>{projects.length} projeto(s)</span>
        </div>

        {projects.length > 0 ? (
          <div className={styles.clientProjectGrid}>
            {projects.map((project) => {
              const hasCharge = project.value > 0
              const projectStatusClass =
                project.status === "Entregue"
                  ? styles.statusActive
                  : project.status === "Cancelado"
                    ? styles.statusBlocked
                    : ""
              const paymentStatusClass = !hasCharge
                ? styles.paymentStatusFree
                : project.paymentStatus === "Pago"
                  ? styles.paymentStatusPaid
                  : styles.paymentStatusPending

              return (
                <article key={project.id} className={styles.clientProjectCard}>
                  <div className={styles.clientProjectTop}>
                    <div>
                      <h4 className={styles.clientProjectTitle}>{project.name}</h4>
                      <p className={styles.clientProjectMeta}>{project.type}</p>
                    </div>
                    <span className={`${styles.statusPill} ${projectStatusClass}`}>{project.status}</span>
                  </div>

                  <div className={styles.clientProjectDetails}>
                    <div className={styles.clientProjectDetail}>
                      <span>Valor</span>
                      <strong>{hasCharge ? formatMoney(project.value) : "Sem cobranca"}</strong>
                    </div>
                    <div className={styles.clientProjectDetail}>
                      <span>Entrega</span>
                      <strong>{formatDate(project.dueDate)}</strong>
                    </div>
                    <div className={styles.clientProjectDetail}>
                      <span>Pagamento</span>
                      <strong className={`${styles.paymentStatus} ${paymentStatusClass}`}>
                        {hasCharge ? project.paymentStatus : "Sem cobranca"}
                      </strong>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>Nenhum projeto cadastrado para o seu perfil.</div>
        )}
      </div>
    </div>
  )
}

type PaymentTabProps = {
  clientUser: ClientAuthUser | null
  projects: PaymentProject[]
}

function PaymentTab({ clientUser, projects }: PaymentTabProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState("")

  useEffect(() => {
    setSelectedProjectId((currentProjectId) =>
      projects.some((project) => project.id === currentProjectId) ? currentProjectId : projects[0]?.id ?? "",
    )
  }, [projects])

  async function handlePaymentRequest() {
    if (!clientUser || !selectedProjectId) return

    setIsCreatingPayment(true)
    setPaymentMessage("")

    try {
      const response = await fetch("/api/payments/abacate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clientUser.id,
          projectId: selectedProjectId,
        }),
      })

      const payload = (await response.json()) as { url?: string; message?: string }

      if (!response.ok || !payload.url) {
        setPaymentMessage(payload.message ?? "Nao foi possivel gerar o link de pagamento.")
        return
      }

      window.location.href = payload.url
    } catch {
      setPaymentMessage("Nao foi possivel conectar com o pagamento agora.")
    } finally {
      setIsCreatingPayment(false)
    }
  }

  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  return (
    <div className={styles.paymentTab}>
      <div>
        <h2 className={styles.sectionTitle}>Pagamentos</h2>
        <p className={styles.sectionIntro}>Selecione um projeto em aberto para gerar o checkout de pagamento.</p>

        <div className={styles.invoiceList}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <label
                key={project.id}
                className={`${styles.paymentProjectOption} ${
                  selectedProjectId === project.id ? styles.paymentProjectOptionActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment-project"
                  value={project.id}
                  checked={selectedProjectId === project.id}
                  onChange={() => setSelectedProjectId(project.id)}
                  className={styles.paymentProjectRadio}
                />
                <div className={styles.paymentProjectInfo}>
                  <strong>{project.name}</strong>
                  <span>{project.type} - entrega {formatDate(project.dueDate)}</span>
                </div>
                <strong className={styles.invoiceValue}>{formatMoney(project.value)}</strong>
                <span className={styles.paymentStatusPending}>{project.paymentStatus}</span>
              </label>
            ))
          ) : (
            <div className={styles.emptyState}>Nenhum projeto em aberto para pagamento.</div>
          )}
        </div>

        {selectedProject && (
          <p className={styles.paymentHint}>
            O valor do checkout sera puxado do projeto selecionado: {formatMoney(selectedProject.value)}.
          </p>
        )}

        {paymentMessage && <p className={styles.paymentError}>{paymentMessage}</p>}
      </div>

      <div className={styles.paymentActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handlePaymentRequest}
          disabled={!selectedProjectId || isCreatingPayment}
        >
          <CreditCard className={styles.smallIcon} />
          {isCreatingPayment ? "Gerando pagamento..." : "Solicitar link de pagamento"}
        </button>
      </div>
    </div>
  )
}
