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
import {
  applyApiMessagesToConversations,
  createAttachments,
  createEmptyConversation,
  createProductCatalogDraft,
  createProjectDraft,
  ensureConversations,
  formatDate,
  formatFileSize,
  formatMoney,
  getInitials,
  initialAdminState,
  isImageAttachment,
  mapApiMessageToAdmin,
  mapApiProjectToAdmin,
  mergeRegisteredClients,
  statusOptions,
  type AdminAttachment,
  type AdminMessage,
  type AdminProject,
  type AdminState,
  type ApiMessage,
  type ApiProject,
  type ConversationStatus,
  type PaymentStatus,
  type ProjectStatus,
  type RegisteredClient,
} from "./admin-state"

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
                        <div className={styles.emptyState}>Nenhuma mensagem registrada no banco.</div>
                      )}
                    </div>

                    <form className={styles.composer} onSubmit={handleReplySubmit}>
                      {replyAttachments.length > 0 && (
                        <div className={styles.attachmentPreview}>
                          {replyAttachments.map((attachment) =>
                            attachment.dataUrl && isImageAttachment(attachment) ? (
                              <div key={attachment.id} className={styles.attachmentImagePreview}>
                                <img src={attachment.dataUrl} alt={attachment.name} />
                                <div className={styles.attachmentImageInfo}>
                                  <span>{attachment.name}</span>
                                  <small>{formatFileSize(attachment.size)}</small>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeReplyAttachment(attachment.id)}
                                  aria-label={`Remover ${attachment.name}`}
                                >
                                  <X className={styles.smallIcon} />
                                </button>
                              </div>
                            ) : (
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
