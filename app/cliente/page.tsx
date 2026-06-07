"use client"

import { PointerEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, FileText, MessageCircle, User } from "lucide-react"
import { clearClientAuth, getClientAuth, updateClientAuth } from "@/lib/client-auth"
import type { ClientAuthUser } from "@/lib/client-auth"
import type { PurchaseProduct } from "@/lib/product-catalog"
import styles from "./cliente.module.css"
import { ClientNavbar, ContactTab, PaymentTab, ProductsTab, ProfileTab } from "./cliente-components"
import type {
  ApiMessage,
  ChatAttachment,
  ChatMessage,
  NotificationItem,
  NotificationsPayload,
  PaymentProject,
} from "./cliente-types"
import { createClientMessage, getInitials, mapApiMessageToClient } from "./cliente-utils"

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "contato", label: "Contato", icon: MessageCircle },
  { id: "produtos", label: "Produtos", icon: FileText },
  { id: "pagamento", label: "Pagamento", icon: CreditCard },
] as const

type ClientTabId = (typeof tabs)[number]["id"]

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
