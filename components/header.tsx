"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, CheckCheck, ChevronDown, CreditCard, FileText, LayoutDashboard, LogIn, LogOut, Menu, MessageCircle, Sparkles, User, UserPlus, X } from "lucide-react"
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion"
import { useRouter } from "next/navigation"
import { clearClientAuth, ClientAuthUser, getClientAuth } from "@/lib/client-auth"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/produto", label: "Produtos" },
  { href: "/#servicos", label: "Servicos" },
  { href: "/#beneficios", label: "Beneficios" },
  { href: "/#sobre", label: "Sobre" },
]

type NotificationItem = {
  id: string
  type: string
  title: string
  body: string
  actionUrl: string | null
  actionLabel: string | null
  readAt: string | null
  createdAt: string
}

type NotificationsPayload = {
  notifications?: NotificationItem[]
  unreadCount?: number
}

function formatNotificationTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

function NotificationIcon({ type }: { type: string }) {
  if (type === "message") return <MessageCircle className="h-4 w-4" />
  if (type.startsWith("payment")) return <CreditCard className="h-4 w-4" />
  if (type === "client_registered") return <User className="h-4 w-4" />
  if (type.startsWith("project")) return <FileText className="h-4 w-4" />

  return <Bell className="h-4 w-4" />
}

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
  const [clientUser, setClientUser] = useState<ClientAuthUser | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const dashboardHref = clientUser?.role === "admin" ? "/admin" : "/cliente"
  const dashboardLabel = clientUser?.role === "admin" ? "Painel Admin" : "Area do Cliente"

  useEffect(() => {
    setClientUser(getClientAuth())
  }, [])

  useEffect(() => {
    if (!clientUser) {
      setNotifications([])
      setUnreadNotifications(0)
      return
    }

    let isMounted = true
    const currentUser = clientUser

    async function loadNotifications() {
      const query =
        currentUser.role === "admin"
          ? "audience=admin"
          : `audience=client&userId=${encodeURIComponent(currentUser.id)}`

      try {
        const response = await fetch(`/api/notifications?${query}`, { cache: "no-store" })

        if (!response.ok) return

        const payload = (await response.json()) as NotificationsPayload

        if (isMounted) {
          setNotifications(payload.notifications ?? [])
          setUnreadNotifications(payload.unreadCount ?? 0)
        }
      } catch {
        return
      }
    }

    loadNotifications()
    const refreshId = window.setInterval(loadNotifications, 5000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [clientUser])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 18)
  })

  function handleLogout() {
    clearClientAuth()
    setClientUser(null)
    setUserMenuOpen(false)
    setNotificationMenuOpen(false)
    setMobileMenuOpen(false)
  }

  async function markNotificationsAsRead(ids?: string[]) {
    if (!clientUser) return

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: clientUser.role === "admin" ? "admin" : "client",
          userId: clientUser.id,
          action: "read",
          all: !ids,
          ids,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as NotificationsPayload
      setNotifications(payload.notifications ?? [])
      setUnreadNotifications(payload.unreadCount ?? 0)
    } catch {
      return
    }
  }

  function openNotification(notification: NotificationItem) {
    markNotificationsAsRead([notification.id])
    setNotificationMenuOpen(false)
    setMobileMenuOpen(false)

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const visibleNotifications = notifications.slice(0, 4)

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-primary/20 bg-background/72 shadow-[0_18px_70px_rgba(37,99,235,0.14)] backdrop-blur-2xl"
          : "border-transparent bg-background/38 backdrop-blur-md"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent transition-opacity duration-300 ${
          isScrolled ? "opacity-100" : "opacity-35"
        }`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 360, damping: 18 }}
              className="nova-logo-mark flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-sky-500 to-accent shadow-[0_14px_34px_rgba(37,99,235,0.32)]"
            >
              <Sparkles className="relative z-10 w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-black text-foreground transition-colors group-hover:text-primary">
              NovaCore<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Client Actions */}
            {clientUser ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationMenuOpen((isOpen) => !isOpen)
                      setUserMenuOpen(false)
                    }}
                    className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/70 text-foreground transition-all hover:border-primary/35 hover:bg-card ${
                      unreadNotifications > 0 ? "notification-alert-button text-destructive" : ""
                    }`}
                    aria-label="Abrir notificacoes"
                    title="Notificacoes"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[0.68rem] font-black leading-4 text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-3 grid w-[360px] max-w-[calc(100vw-28px)] gap-2 rounded-xl border border-border bg-card p-3 shadow-2xl shadow-black/10 dark:shadow-black/30">
                      <div className="flex items-center justify-between gap-3 px-1">
                        <span className="text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">
                          Atualizacoes
                        </span>
                        {unreadNotifications > 0 && (
                          <button
                            type="button"
                            onClick={() => markNotificationsAsRead()}
                            className="inline-flex min-h-7 items-center gap-1 rounded-full border border-border px-2 text-xs font-bold text-foreground hover:bg-muted"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Marcar
                          </button>
                        )}
                      </div>

                      {visibleNotifications.length > 0 ? (
                        visibleNotifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => openNotification(notification)}
                            className={`grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-lg border p-2 text-left transition-colors hover:bg-muted ${
                              notification.readAt ? "border-transparent" : "border-destructive/20 bg-destructive/10"
                            }`}
                          >
                            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <NotificationIcon type={notification.type} />
                            </span>
                            <span className="grid min-w-0 gap-0.5">
                              <strong className="truncate text-sm font-black text-foreground">{notification.title}</strong>
                              <span className="truncate text-xs text-muted-foreground">{notification.body}</span>
                              <small className="text-[0.72rem] font-bold text-muted-foreground">
                                {formatNotificationTime(notification.createdAt)}
                              </small>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-center text-sm font-semibold text-muted-foreground">
                          Nenhuma atualizacao nova.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen((isOpen) => !isOpen)
                      setNotificationMenuOpen(false)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/70 hover:border-primary/35 hover:bg-card text-foreground rounded-lg text-sm font-semibold transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
                  >
                    <User className="w-4 h-4 text-primary" />
                    {clientUser.name}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/30">
                      <Link
                        href={dashboardHref}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        {dashboardLabel}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/70 hover:border-primary/35 hover:bg-card text-foreground rounded-lg text-sm font-semibold transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/cliente/cadastrar"
                  className="cinematic-cta inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-all hover:scale-[1.03]"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {clientUser && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/60 text-foreground backdrop-blur transition-colors hover:border-primary/35 ${
                  unreadNotifications > 0 ? "notification-alert-button text-destructive" : ""
                }`}
                aria-label="Abrir notificacoes"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[0.68rem] font-black leading-4 text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-border bg-card/60 p-2 text-foreground backdrop-blur transition-colors hover:border-primary/35"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-primary/15 bg-background/86 backdrop-blur-2xl"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              {clientUser ? (
                <div className="mt-2 flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3">
                  <div className="grid gap-2 rounded-lg border border-border bg-background/50 p-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">
                        Atualizacoes
                      </span>
                      {unreadNotifications > 0 && (
                        <button
                          type="button"
                          onClick={() => markNotificationsAsRead()}
                          className="inline-flex min-h-7 items-center gap-1 rounded-full border border-border px-2 text-xs font-bold text-foreground"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Marcar
                        </button>
                      )}
                    </div>
                    {visibleNotifications.length > 0 ? (
                      visibleNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => openNotification(notification)}
                          className={`grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-lg border p-2 text-left ${
                            notification.readAt ? "border-transparent" : "border-destructive/20 bg-destructive/10"
                          }`}
                        >
                          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <NotificationIcon type={notification.type} />
                          </span>
                          <span className="grid min-w-0 gap-0.5">
                            <strong className="truncate text-sm font-black text-foreground">{notification.title}</strong>
                            <span className="truncate text-xs text-muted-foreground">{notification.body}</span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-center text-sm font-semibold text-muted-foreground">
                        Nenhuma atualizacao nova.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-foreground">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p>{clientUser.name}</p>
                      <p className="text-xs text-muted-foreground">{clientUser.email}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {dashboardLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-destructive/20 bg-destructive/10 text-destructive rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-border bg-card/70 hover:bg-card text-foreground rounded-lg text-sm font-medium transition-colors mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/cliente/cadastrar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="cinematic-cta inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
