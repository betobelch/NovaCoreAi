"use client"

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  TrendingUp,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react"
import { getClientAuth } from "@/lib/client-auth"
import type { PurchaseProduct } from "@/lib/product-catalog"
import styles from "./admin.module.css"

type ProjectStatus = "Aguardando" | "Em andamento" | "Entregue" | "Pausado" | "Cancelado"
type ConversationStatus = "Aberta" | "Resolvida"
type PaymentStatus = "Pendente" | "Pago" | "Reembolsado" | "Cancelado" | "Em disputa"

type AdminClient = {
  id: string
  name: string
  company: string
  email: string
  segment: string
  status: "Ativo" | "Lead"
  lastContact: string
}

type AdminProject = {
  id: string
  clientId: string
  name: string
  type: string
  status: ProjectStatus
  paymentStatus: PaymentStatus
  value: number
  cost: number
  dueDate: string
  abacateCheckoutUrl?: string | null
  paidAt?: string | null
}

type AdminMessage = {
  id: string
  author: "client" | "admin"
  name: string
  text: string
  time: string
  attachments?: AdminAttachment[]
}

type AdminAttachment = {
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
  attachments?: AdminAttachment[]
  createdAt: string
  client?: {
    id: string
    name: string
    company: string
    email: string
    cpf?: string
  }
}

type ApiProject = {
  id: string
  clientId: string
  userId: string
  name: string
  type: string
  status: ProjectStatus
  paymentStatus: PaymentStatus
  value: number
  cost: number
  dueDate: string
  abacateCheckoutUrl?: string | null
  paidAt?: string | null
  client?: {
    id: string
    name: string
    company: string
    email: string
  } | null
}

type Conversation = {
  status: ConversationStatus
  messages: AdminMessage[]
}

type AdminState = {
  clients: AdminClient[]
  projects: AdminProject[]
  conversations: Record<string, Conversation>
}

type RegisteredClient = {
  id: string
  name: string
  company?: string
  email: string
}

type ProjectDraft = {
  clientId: string
  name: string
  type: string
  value: string
  cost: string
  dueDate: string
}

type ProductCatalogDraft = {
  name: string
  description: string
  model: string
}

const statusOptions: ProjectStatus[] = ["Aguardando", "Em andamento", "Entregue", "Pausado", "Cancelado"]

const initialAdminState: AdminState = {
  clients: [],
  projects: [],
  conversations: {},
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

function formatDate(date: string) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`))
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(createdAt))
}

function mapApiMessageToAdmin(message: ApiMessage): AdminMessage {
  return {
    id: message.id,
    author: message.author,
    name: message.name,
    text: message.text,
    attachments: message.attachments ?? [],
    time: formatMessageTime(message.createdAt),
  }
}

function mapApiProjectToAdmin(project: ApiProject): AdminProject {
  return {
    id: project.id,
    clientId: project.clientId || project.userId,
    name: project.name,
    type: project.type,
    status: project.status,
    paymentStatus: project.paymentStatus,
    value: project.value,
    cost: project.cost,
    dueDate: project.dueDate,
    abacateCheckoutUrl: project.abacateCheckoutUrl,
    paidAt: project.paidAt,
  }
}

function getStatusClass(status: ProjectStatus) {
  if (status === "Entregue") return styles.statusDone
  if (status === "Em andamento") return styles.statusActive
  if (status === "Pausado") return styles.statusPaused
  if (status === "Cancelado") return styles.statusCanceled
  return styles.statusWaiting
}

function getPaymentStatusClass(status: PaymentStatus) {
  if (status === "Pago") return styles.statusDone
  if (status === "Reembolsado" || status === "Cancelado") return styles.statusCanceled
  if (status === "Em disputa") return styles.statusPaused
  return styles.statusWaiting
}

function getConversationClass(status: ConversationStatus) {
  return status === "Aberta" ? styles.statusActive : styles.statusDone
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

function createProjectDraft(clientId: string): ProjectDraft {
  return {
    clientId,
    name: "",
    type: "Produto unico",
    value: "",
    cost: "",
    dueDate: "",
  }
}

function createProductCatalogDraft(): ProductCatalogDraft {
  return {
    name: "",
    description: "",
    model: "Produto sob medida",
  }
}

function createEmptyConversation(clientName: string): Conversation {
  return {
    status: "Aberta",
    messages: [],
  }
}

function ensureConversations(state: AdminState): AdminState {
  const conversations = { ...state.conversations }

  state.clients.forEach((client) => {
    if (!conversations[client.id]) {
      conversations[client.id] = createEmptyConversation(client.name)
    }
  })

  return {
    ...state,
    conversations,
  }
}

function mergeRegisteredClients(state: AdminState, registeredClients: RegisteredClient[]): AdminState {
  const nextState = ensureConversations(state)
  const clients = [...nextState.clients]
  const conversations = { ...nextState.conversations }
  const projects = [...nextState.projects]

  registeredClients.forEach((registeredClient) => {
    const normalizedEmail = registeredClient.email.trim().toLowerCase()
    const existingClientIndex = clients.findIndex((client) => client.email.trim().toLowerCase() === normalizedEmail)

    if (existingClientIndex >= 0) {
      const existingClient = clients[existingClientIndex]
      const previousId = existingClient.id

      clients[existingClientIndex] = {
        ...existingClient,
        id: registeredClient.id,
        name: registeredClient.name || existingClient.name,
        company: registeredClient.company || existingClient.company,
        email: normalizedEmail,
      }

      if (previousId !== registeredClient.id) {
        conversations[registeredClient.id] = conversations[previousId] ?? createEmptyConversation(existingClient.name)
        delete conversations[previousId]

        projects.forEach((project) => {
          if (project.clientId === previousId) {
            project.clientId = registeredClient.id
          }
        })
      }

      if (!conversations[registeredClient.id]) {
        conversations[registeredClient.id] = createEmptyConversation(existingClient.name)
      }

      return
    }

    const adminClient: AdminClient = {
      id: registeredClient.id,
      name: registeredClient.name,
      company: registeredClient.company || "Cliente sem empresa",
      email: normalizedEmail,
      segment: "Cadastrado",
      status: "Lead",
      lastContact: "Cadastro recente",
    }

    clients.push(adminClient)
    conversations[adminClient.id] = createEmptyConversation(adminClient.name)
  })

  return {
    ...nextState,
    clients,
    projects,
    conversations,
  }
}

function applyApiMessagesToConversations(state: AdminState, apiMessages: ApiMessage[]): AdminState {
  const nextState = mergeRegisteredClients(
    state,
    apiMessages
      .filter((message) => message.client || message.author === "client")
      .map((message) => ({
        id: message.userId,
        name: message.client?.name || message.name || "Cliente",
        company: message.client?.company || "Cliente via chat",
        email: message.client?.email || `${message.userId}@chat.local`,
      })),
  )
  const groupedMessages = apiMessages.reduce<Record<string, AdminMessage[]>>((groups, message) => {
    groups[message.userId] = groups[message.userId] ?? []
    groups[message.userId].push(mapApiMessageToAdmin(message))
    return groups
  }, {})
  const conversations = { ...nextState.conversations }

  nextState.clients.forEach((client) => {
    const messages = groupedMessages[client.id]

    if (!messages) return

    conversations[client.id] = {
      status: conversations[client.id]?.status ?? "Aberta",
      messages,
    }
  })

  return {
    ...nextState,
    conversations,
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminState>(initialAdminState)
  const [selectedClientId, setSelectedClientId] = useState("")
  const [search, setSearch] = useState("")
  const [projectFilter, setProjectFilter] = useState<"Todos" | ProjectStatus>("Todos")
  const [reply, setReply] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<AdminAttachment[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [projectDraft, setProjectDraft] = useState(() => createProjectDraft(""))
  const [purchaseProducts, setPurchaseProducts] = useState<PurchaseProduct[]>([])
  const [productDraft, setProductDraft] = useState(() => createProductCatalogDraft())
  const [projectPendingDeletion, setProjectPendingDeletion] = useState<AdminProject | null>(null)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [deleteProjectError, setDeleteProjectError] = useState("")
  const [hasAppliedClientParam, setHasAppliedClientParam] = useState(false)

  useEffect(() => {
    const savedUser = getClientAuth()

    if (savedUser?.role !== "admin") {
      router.replace("/login")
      return
    }

    setIsAdmin(true)
  }, [router])

  useEffect(() => {
    if (!isAdmin) return

    let isMounted = true

    async function loadAdminData() {
      let nextData = initialAdminState

      try {
        const response = await fetch("/api/admin/clients", { cache: "no-store" })

        if (response.ok) {
          const payload = (await response.json()) as { clients?: RegisteredClient[] }
          nextData = mergeRegisteredClients(nextData, payload.clients ?? [])
        }
      } catch {
        nextData = ensureConversations(nextData)
      }

      try {
        const projectsResponse = await fetch("/api/projects", { cache: "no-store" })

        if (projectsResponse.ok) {
          const projectsPayload = (await projectsResponse.json()) as { projects?: ApiProject[] }
          nextData = {
            ...nextData,
            projects: (projectsPayload.projects ?? []).map(mapApiProjectToAdmin),
          }
        }
      } catch {
        nextData = ensureConversations(nextData)
      }

      try {
        const messagesResponse = await fetch("/api/messages", { cache: "no-store" })

        if (messagesResponse.ok) {
          const messagesPayload = (await messagesResponse.json()) as { messages?: ApiMessage[] }
          nextData = applyApiMessagesToConversations(nextData, messagesPayload.messages ?? [])
        }
      } catch {
        nextData = ensureConversations(nextData)
      }

      if (!isMounted) return

      const firstClientId = nextData.clients[0]?.id ?? ""

      setData(nextData)

      try {
        const productsResponse = await fetch("/api/products", { cache: "no-store" })

        if (productsResponse.ok) {
          const productsPayload = (await productsResponse.json()) as { products?: PurchaseProduct[] }
          setPurchaseProducts(productsPayload.products ?? [])
        }
      } catch {
        setPurchaseProducts([])
      }

      setSelectedClientId((currentClientId) =>
        nextData.clients.some((client) => client.id === currentClientId) ? currentClientId : firstClientId,
      )
      setProjectDraft((currentDraft) => ({
        ...currentDraft,
        clientId: nextData.clients.some((client) => client.id === currentDraft.clientId)
          ? currentDraft.clientId
          : firstClientId,
      }))
    }

    loadAdminData()
    const refreshId = window.setInterval(loadAdminData, 5000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [isAdmin])

  useEffect(() => {
    if (hasAppliedClientParam) return

    const requestedClientId = new URLSearchParams(window.location.search).get("clientId")

    if (requestedClientId && data.clients.some((client) => client.id === requestedClientId)) {
      setSelectedClientId(requestedClientId)
      setHasAppliedClientParam(true)
    }
  }, [data.clients, hasAppliedClientParam])

  useEffect(() => {
    if (!selectedClientId) return
    setProjectDraft((currentDraft) => ({ ...currentDraft, clientId: selectedClientId }))
  }, [selectedClientId])

  const selectedClient = data.clients.find((client) => client.id === selectedClientId) ?? data.clients[0]
  const selectedConversation = data.conversations[selectedClient?.id]

  const metrics = useMemo(() => {
    const totalRevenue = data.projects.reduce((total, project) => total + project.value, 0)
    const totalCost = data.projects.reduce((total, project) => total + project.cost, 0)
    const activeProjects = data.projects.filter((project) => project.status === "Em andamento").length
    const openConversations = Object.values(data.conversations).filter(
      (item) => item.status === "Aberta" && item.messages.length > 0,
    ).length

    return {
      totalProjects: data.projects.length,
      activeProjects,
      clients: data.clients.length,
      totalRevenue,
      profit: totalRevenue - totalCost,
      openConversations,
    }
  }, [data])

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) return data.clients

    return data.clients.filter((client) =>
      [client.name, client.company, client.email, client.segment].some((field) =>
        field.toLowerCase().includes(normalizedSearch),
      ),
    )
  }, [data.clients, search])

  const selectedProjects = data.projects.filter((project) => project.clientId === selectedClient?.id)

  const tableProjects = data.projects.filter((project) =>
    projectFilter === "Todos" ? true : project.status === projectFilter,
  )
  const projectPendingDeletionClient = projectPendingDeletion
    ? data.clients.find((client) => client.id === projectPendingDeletion.clientId)
    : null

  async function updateProjectStatus(projectId: string, status: ProjectStatus) {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project) => (project.id === projectId ? { ...project, status } : project)),
    }))

    try {
      const response = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, status }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as { project?: ApiProject }

      if (payload.project) {
        const savedProject = mapApiProjectToAdmin(payload.project)

        setData((current) => ({
          ...current,
          projects: current.projects.map((project) => (project.id === savedProject.id ? savedProject : project)),
        }))
      }
    } catch {
      return
    }
  }

  function updateConversationStatus(status: ConversationStatus) {
    if (!selectedClient) return

    setData((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [selectedClient.id]: {
          ...(current.conversations[selectedClient.id] ?? createEmptyConversation(selectedClient.name)),
          status,
        },
      },
    }))
  }

  async function submitReplyMessage() {
    if (!selectedClient || (!reply.trim() && replyAttachments.length === 0)) return

    const nextMessage: AdminMessage = {
      id: `msg-${Date.now()}`,
      author: "admin",
      name: "NovaCore AI",
      text: reply.trim() || "Arquivo enviado.",
      time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      attachments: replyAttachments,
    }

    const replyText = reply.trim() || "Arquivo enviado."

    setData((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [selectedClient.id]: {
          status: "Aberta",
          messages: [
            ...(current.conversations[selectedClient.id] ?? createEmptyConversation(selectedClient.name)).messages,
            nextMessage,
          ],
        },
      },
    }))
    setReply("")
    setReplyAttachments([])

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedClient.id,
          author: "admin",
          text: replyText,
          clientName: selectedClient.name,
          clientCompany: selectedClient.company,
          clientEmail: selectedClient.email,
          attachments: replyAttachments,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as { message?: ApiMessage }

      if (payload.message) {
        const savedMessage = mapApiMessageToAdmin(payload.message)

        setData((current) => ({
          ...current,
          conversations: {
            ...current.conversations,
            [selectedClient.id]: {
              status: "Aberta",
              messages: (current.conversations[selectedClient.id] ?? createEmptyConversation(selectedClient.name)).messages.map(
                (message) => (message.id === nextMessage.id ? savedMessage : message),
              ),
            },
          },
        }))
      }
    } catch {
      return
    }
  }

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitReplyMessage()
  }

  function handleReplyKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return

    event.preventDefault()
    void submitReplyMessage()
  }

  async function handleReplyAttachmentChange(files: FileList | null) {
    if (!files?.length) return
    const nextAttachments = await createAttachments(files)
    setReplyAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments])
  }

  function removeReplyAttachment(attachmentId: string) {
    setReplyAttachments((currentAttachments) =>
      currentAttachments.filter((attachment) => attachment.id !== attachmentId),
    )
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const projectClient = data.clients.find((client) => client.id === projectDraft.clientId) ?? selectedClient

    if (!projectClient || !projectDraft.name.trim()) return

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: projectClient.id,
        clientName: projectClient.name,
        clientCompany: projectClient.company,
        clientEmail: projectClient.email,
        name: projectDraft.name.trim(),
        type: projectDraft.type,
        value: Number(projectDraft.value || 0),
        cost: Number(projectDraft.cost || 0),
        dueDate: projectDraft.dueDate || new Date().toISOString().slice(0, 10),
      }),
    })

    if (!response.ok) return

    const payload = (await response.json()) as { project?: ApiProject }

    if (!payload.project) {
      return
    }

    const nextProject = mapApiProjectToAdmin(payload.project)

    setData((current) => ({
      ...current,
      projects: [nextProject, ...current.projects],
    }))
    setSelectedClientId(projectClient.id)
    setProjectDraft(createProjectDraft(projectClient.id))
  }

  async function handleProductCatalogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!productDraft.name.trim() || !productDraft.description.trim()) return

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productDraft.name.trim(),
        description: productDraft.description.trim(),
        model: productDraft.model.trim() || "Produto sob medida",
      }),
    })

    if (!response.ok) return

    const payload = (await response.json()) as { products?: PurchaseProduct[] }

    setPurchaseProducts(payload.products ?? purchaseProducts)
    setProductDraft(createProductCatalogDraft())
  }

  function requestProjectDeletion(projectId: string) {
    const project = data.projects.find((item) => item.id === projectId)

    if (!project) return

    setProjectPendingDeletion(project)
    setDeleteProjectError("")
  }

  function closeProjectDeletionModal() {
    if (isDeletingProject) return

    setProjectPendingDeletion(null)
    setDeleteProjectError("")
  }

  async function confirmProjectDeletion() {
    if (!projectPendingDeletion) return

    setIsDeletingProject(true)
    setDeleteProjectError("")

    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectPendingDeletion.id }),
      })
      const payload = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        setDeleteProjectError(payload?.message ?? "Nao foi possivel excluir este projeto agora.")
        setIsDeletingProject(false)
        return
      }

      setData((current) => ({
        ...current,
        projects: current.projects.filter((item) => item.id !== projectPendingDeletion.id),
      }))
      setProjectPendingDeletion(null)
      setIsDeletingProject(false)
    } catch {
      setDeleteProjectError("Nao foi possivel conectar com o servidor agora.")
      setIsDeletingProject(false)
    }
  }

  async function removePurchaseProduct(productId: string) {
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    })

    if (!response.ok) return

    const payload = (await response.json()) as { products?: PurchaseProduct[] }

    setPurchaseProducts(payload.products ?? purchaseProducts.filter((product) => product.id !== productId))
  }

  if (!isAdmin) {
    return (
      <main className={styles.adminPage}>
        <div className={styles.shell}>
          <div className={styles.authState}>
            <Clock3 className={styles.metricSvg} />
            <p>Verificando acesso administrativo...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.adminPage}>
      <div className={styles.shell}>
        <section className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>Painel administrativo</span>
            <h1 className={styles.title}>Adm NovaCore AI</h1>
          </div>
          <div className={styles.topbarActions}>
            <div className={styles.periodBadge}>
              <BarChart3 className={styles.smallIcon} />
              Junho 2026
            </div>
          </div>
        </section>

        <section className={styles.metricsGrid} aria-label="Indicadores administrativos">
          <MetricCard icon={Briefcase} label="Projetos" value={String(metrics.totalProjects)} note={`${metrics.activeProjects} em andamento`} />
          <MetricCard icon={Users} label="Clientes" value={String(metrics.clients)} note={`${metrics.openConversations} conversas abertas`} />
          <MetricCard icon={DollarSign} label="Receita" value={formatMoney(metrics.totalRevenue)} note="valor bruto em carteira" />
          <MetricCard icon={TrendingUp} label="Lucro" value={formatMoney(metrics.profit)} note="receita menos custo" />
        </section>

        <section className={styles.workspace}>
          <aside className={styles.clientsPanel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Clientes</h2>
                <p>Carteira e conversas</p>
              </div>
            </div>

            <label className={styles.searchBox}>
              <Search className={styles.inputIcon} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cliente"
              />
            </label>

            <div className={styles.clientList}>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                const clientProjects = data.projects.filter((project) => project.clientId === client.id)
                const clientRevenue = clientProjects.reduce((total, project) => total + project.value, 0)
                const isSelected = selectedClient?.id === client.id

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClientId(client.id)}
                    className={`${styles.clientButton} ${isSelected ? styles.clientButtonActive : ""}`}
                  >
                    <span className={styles.avatar}>{getInitials(client.name)}</span>
                    <span className={styles.clientInfo}>
                      <span className={styles.clientTopline}>
                        <strong>{client.name}</strong>
                        <span className={client.status === "Ativo" ? styles.clientActive : styles.clientLead}>
                          {client.status}
                        </span>
                      </span>
                      <span>{client.company}</span>
                      <span className={styles.clientMeta}>
                        {clientProjects.length} projetos · {formatMoney(clientRevenue)}
                      </span>
                    </span>
                  </button>
                )
                })
              ) : (
                <div className={styles.emptyState}>Nenhum cliente cadastrado no banco.</div>
              )}
            </div>
          </aside>

          <section className={styles.detailPanel}>
            {selectedClient ? (
              <>
                <div className={styles.clientHeader}>
                  <div className={styles.clientIdentity}>
                    <span className={styles.largeAvatar}>{getInitials(selectedClient.name)}</span>
                    <div>
                      <span className={styles.eyebrow}>{selectedClient.segment}</span>
                      <h2>{selectedClient.company}</h2>
                      <p>{selectedClient.name}</p>
                    </div>
                  </div>
                  <div className={styles.contactStack}>
                    <span>
                      <Mail className={styles.smallIcon} />
                      {selectedClient.email}
                    </span>
                    <span>
                      <Clock3 className={styles.smallIcon} />
                      {selectedClient.lastContact}
                    </span>
                  </div>
                </div>

                <div className={styles.detailGrid}>
                  <section className={styles.conversationPanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h2>Conversa</h2>
                        <p>Atendimento do cliente</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateConversationStatus(selectedConversation?.status === "Aberta" ? "Resolvida" : "Aberta")
                        }
                        className={`${styles.statusButton} ${getConversationClass(selectedConversation?.status ?? "Aberta")}`}
                      >
                        <MessageSquare className={styles.smallIcon} />
                        {selectedConversation?.status ?? "Aberta"}
                      </button>
                    </div>

                    <div className={styles.messageList}>
                      {selectedConversation?.messages.length ? (
                        selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`${styles.messageRow} ${message.author === "admin" ? styles.messageRowAdmin : ""}`}
                        >
                          <div className={`${styles.messageBubble} ${message.author === "admin" ? styles.messageBubbleAdmin : ""}`}>
                            <span className={styles.messageMeta}>
                              <strong>{message.name}</strong>
                              <span>{message.time}</span>
                            </span>
                            <p>{message.text}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className={styles.messageAttachments}>
                                {message.attachments.map((attachment) =>
                                  attachment.dataUrl ? (
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
                        <div className={styles.emptyState}>Nenhuma mensagem registrada no banco.</div>
                      )}
                    </div>

                    <form className={styles.composer} onSubmit={handleReplySubmit}>
                      {replyAttachments.length > 0 && (
                        <div className={styles.attachmentPreview}>
                          {replyAttachments.map((attachment) => (
                            <div key={attachment.id} className={styles.attachmentChip}>
                              <FileText className={styles.smallIcon} />
                              <span>{attachment.name}</span>
                              <small>{formatFileSize(attachment.size)}</small>
                              <button
                                type="button"
                                onClick={() => removeReplyAttachment(attachment.id)}
                                aria-label={`Remover ${attachment.name}`}
                              >
                                <X className={styles.smallIcon} />
                              </button>
                            </div>
                          ))}
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
                              handleReplyAttachmentChange(event.target.files)
                              event.target.value = ""
                            }}
                          />
                        </label>
                        <textarea
                          value={reply}
                          onChange={(event) => setReply(event.target.value)}
                          onKeyDown={handleReplyKeyDown}
                          rows={2}
                          placeholder="Responder cliente"
                        />
                        <button type="submit" aria-label="Enviar resposta">
                          <Send className={styles.smallIcon} />
                        </button>
                      </div>
                    </form>
                  </section>

                  <section className={styles.projectsPanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h2>Projetos</h2>
                        <p>{selectedProjects.length} itens deste cliente</p>
                      </div>
                    </div>

                    <div className={styles.projectList}>
                      {selectedProjects.length > 0 ? (
                        selectedProjects.map((project) => (
                        <article key={project.id} className={styles.projectItem}>
                          <div>
                            <h3>{project.name}</h3>
                            <p>{project.type} - {formatDate(project.dueDate)}</p>
                            <span className={`${styles.paymentChip} ${getPaymentStatusClass(project.paymentStatus)}`}>
                              Pagamento: {project.paymentStatus}
                            </span>
                          </div>
                          <div className={styles.projectMoney}>
                            <strong>{formatMoney(project.value - project.cost)}</strong>
                            <span>lucro</span>
                          </div>
                          <select
                            value={project.status}
                            onChange={(event) => updateProjectStatus(project.id, event.target.value as ProjectStatus)}
                            className={`${styles.statusSelect} ${getStatusClass(project.status)}`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => requestProjectDeletion(project.id)}
                            className={styles.deleteProjectButton}
                            aria-label={`Excluir projeto ${project.name}`}
                            title="Excluir projeto"
                          >
                            <Trash2 className={styles.smallIcon} />
                          </button>
                        </article>
                        ))
                      ) : (
                        <div className={styles.emptyState}>Nenhum projeto registrado no banco.</div>
                      )}
                    </div>

                    <form className={styles.projectForm} onSubmit={handleProjectSubmit}>
                      <h3>Novo projeto</h3>
                      <label className={styles.projectField}>
                        <span>Cliente cadastrado</span>
                        <select
                          value={projectDraft.clientId}
                          onChange={(event) => setProjectDraft((current) => ({ ...current, clientId: event.target.value }))}
                        >
                          {data.clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.company} - {client.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <input
                        value={projectDraft.name}
                        onChange={(event) => setProjectDraft((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Nome do projeto"
                      />
                      <div className={styles.formGrid}>
                        <input
                          value={projectDraft.value}
                          onChange={(event) => setProjectDraft((current) => ({ ...current, value: event.target.value }))}
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Receita"
                        />
                        <input
                          value={projectDraft.cost}
                          onChange={(event) => setProjectDraft((current) => ({ ...current, cost: event.target.value }))}
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Custo"
                        />
                      </div>
                      <div className={styles.formGrid}>
                        <select
                          value={projectDraft.type}
                          onChange={(event) => setProjectDraft((current) => ({ ...current, type: event.target.value }))}
                        >
                          <option>Produto unico</option>
                          <option>Assinatura mensal</option>
                          <option>Suporte recorrente</option>
                        </select>
                        <input
                          value={projectDraft.dueDate}
                          onChange={(event) => setProjectDraft((current) => ({ ...current, dueDate: event.target.value }))}
                          type="date"
                        />
                      </div>
                      <button type="submit">
                        <Plus className={styles.smallIcon} />
                        Adicionar projeto
                      </button>
                    </form>
                  </section>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>Selecione um cliente real cadastrado no banco.</div>
            )}
          </section>
        </section>

        <section className={styles.productCatalogSection}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Cadastrar produto para compra</h2>
              <p>Produtos cadastrados aqui aparecem na aba Produtos do cliente.</p>
            </div>
          </div>

          <div className={styles.productCatalogLayout}>
            <form className={styles.productCatalogForm} onSubmit={handleProductCatalogSubmit}>
              <label className={styles.projectField}>
                <span>Nome do produto</span>
                <input
                  value={productDraft.name}
                  onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nome do produto"
                />
              </label>
              <label className={styles.projectField}>
                <span>Descricao</span>
                <textarea
                  value={productDraft.description}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={3}
                  placeholder="Resumo do que o cliente pode comprar"
                />
              </label>
              <label className={styles.projectField}>
                <span>Modelo de compra</span>
                <select
                  value={productDraft.model}
                  onChange={(event) => setProductDraft((current) => ({ ...current, model: event.target.value }))}
                >
                  <option>Produto sob medida</option>
                  <option>Produto unico</option>
                  <option>Assinatura mensal</option>
                  <option>Produto unico ou recorrente</option>
                  <option>Suporte recorrente</option>
                </select>
              </label>
              <button type="submit">
                <Plus className={styles.smallIcon} />
                Cadastrar produto
              </button>
            </form>

            <div className={styles.productCatalogList}>
              {purchaseProducts.length > 0 ? (
                purchaseProducts.map((product) => (
                <article key={product.id} className={styles.productCatalogCard}>
                  <div className={styles.metricIcon}>
                    <Bot className={styles.metricSvg} />
                  </div>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span>{product.model}</span>
                  </div>
                  <button type="button" onClick={() => removePurchaseProduct(product.id)} aria-label={`Remover ${product.name}`}>
                    <X className={styles.smallIcon} />
                  </button>
                </article>
                ))
              ) : (
                <div className={styles.emptyState}>Nenhum produto cadastrado no banco.</div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Todos os projetos</h2>
              <p>Status, pagamento, receita, custo e lucro por cliente</p>
            </div>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value as "Todos" | ProjectStatus)}
              className={styles.filterSelect}
            >
              <option>Todos</option>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Receita</th>
                  <th>Custo</th>
                  <th>Lucro</th>
                  <th>Entrega</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {tableProjects.length > 0 ? (
                  tableProjects.map((project) => {
                  const client = data.clients.find((item) => item.id === project.clientId)

                  return (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                        <span>{project.type}</span>
                      </td>
                      <td>
                        <span className={styles.inlineClient}>
                          <User className={styles.smallIcon} />
                          {client?.company ?? "Cliente"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={project.status}
                          onChange={(event) => updateProjectStatus(project.id, event.target.value as ProjectStatus)}
                          className={`${styles.statusSelect} ${getStatusClass(project.status)}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className={`${styles.paymentChip} ${getPaymentStatusClass(project.paymentStatus)}`}>
                          {project.paymentStatus}
                        </span>
                      </td>
                      <td>{formatMoney(project.value)}</td>
                      <td>{formatMoney(project.cost)}</td>
                      <td>
                        <span className={styles.profitValue}>
                          <CheckCircle2 className={styles.smallIcon} />
                          {formatMoney(project.value - project.cost)}
                        </span>
                      </td>
                      <td>{formatDate(project.dueDate)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => requestProjectDeletion(project.id)}
                          className={styles.tableActionButton}
                          aria-label={`Excluir projeto ${project.name}`}
                          title="Excluir projeto"
                        >
                          <Trash2 className={styles.smallIcon} />
                        </button>
                      </td>
                    </tr>
                  )
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className={styles.emptyState}>Nenhum projeto registrado no banco.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {projectPendingDeletion && (
        <div className={styles.deleteModalOverlay} role="presentation" onClick={closeProjectDeletionModal}>
          <section
            className={styles.deleteModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.deleteModalClose}
              onClick={closeProjectDeletionModal}
              aria-label="Fechar confirmacao"
              disabled={isDeletingProject}
            >
              <X className={styles.smallIcon} />
            </button>

            <div className={styles.deleteModalIcon}>
              <Trash2 className={styles.metricSvg} />
            </div>

            <div className={styles.deleteModalContent}>
              <span className={styles.eyebrow}>Confirmar exclusao</span>
              <h2 id="delete-project-title">Excluir este projeto?</h2>
              <p>
                O projeto <strong>{projectPendingDeletion.name}</strong> sera removido do banco de dados. Essa acao nao
                pode ser desfeita.
              </p>

              <div className={styles.deleteProjectSummary}>
                <div>
                  <span>Cliente</span>
                  <strong>{projectPendingDeletionClient?.company || projectPendingDeletionClient?.name || "Cliente"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{projectPendingDeletion.status}</strong>
                </div>
                <div>
                  <span>Receita</span>
                  <strong>{formatMoney(projectPendingDeletion.value)}</strong>
                </div>
              </div>

              {deleteProjectError && <p className={styles.deleteModalError}>{deleteProjectError}</p>}
            </div>

            <div className={styles.deleteModalActions}>
              <button type="button" onClick={closeProjectDeletionModal} disabled={isDeletingProject}>
                Cancelar
              </button>
              <button type="button" onClick={confirmProjectDeletion} disabled={isDeletingProject}>
                <Trash2 className={styles.smallIcon} />
                {isDeletingProject ? "Excluindo..." : "Excluir projeto"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

type MetricCardProps = {
  icon: typeof Briefcase
  label: string
  value: string
  note: string
}

function MetricCard({ icon: Icon, label, value, note }: MetricCardProps) {
  return (
    <article className={styles.metricCard}>
      <span className={styles.metricIcon}>
        <Icon className={styles.metricSvg} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </article>
  )
}
