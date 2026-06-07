export type ProjectStatus = "Aguardando" | "Em andamento" | "Entregue" | "Pausado" | "Cancelado"
export type ConversationStatus = "Aberta" | "Resolvida"
export type PaymentStatus = "Pendente" | "Pago" | "Reembolsado" | "Cancelado" | "Em disputa"

export type AdminClient = {
  id: string
  name: string
  company: string
  email: string
  segment: string
  status: "Ativo" | "Lead"
  lastContact: string
}

export type AdminProject = {
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

export type AdminMessage = {
  id: string
  author: "client" | "admin"
  name: string
  text: string
  time: string
  attachments?: AdminAttachment[]
}

export type AdminAttachment = {
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

export type ApiProject = {
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

export type Conversation = {
  status: ConversationStatus
  messages: AdminMessage[]
}

export type AdminState = {
  clients: AdminClient[]
  projects: AdminProject[]
  conversations: Record<string, Conversation>
}

export type RegisteredClient = {
  id: string
  name: string
  company?: string
  email: string
}

export type ProjectDraft = {
  clientId: string
  name: string
  type: string
  value: string
  cost: string
  dueDate: string
}

export type ProductCatalogDraft = {
  name: string
  description: string
  model: string
}

export const statusOptions: ProjectStatus[] = ["Aguardando", "Em andamento", "Entregue", "Pausado", "Cancelado"]

export const initialAdminState: AdminState = {
  clients: [],
  projects: [],
  conversations: {},
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

export function formatDate(date: string) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`))
}

export function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(createdAt))
}

export function mapApiMessageToAdmin(message: ApiMessage): AdminMessage {
  return {
    id: message.id,
    author: message.author,
    name: message.name,
    text: message.text,
    attachments: message.attachments ?? [],
    time: formatMessageTime(message.createdAt),
  }
}

export function mapApiProjectToAdmin(project: ApiProject): AdminProject {
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

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function createAttachments(files: FileList) {
  return Promise.all(Array.from(files).map(async (file) => ({
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type || "Arquivo",
    dataUrl: await readFileAsDataUrl(file),
  })))
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function isImageAttachment(attachment: AdminAttachment) {
  return attachment.type.toLowerCase().startsWith("image/") || Boolean(attachment.dataUrl?.startsWith("data:image/"))
}

export function createProjectDraft(clientId: string): ProjectDraft {
  return {
    clientId,
    name: "",
    type: "Produto unico",
    value: "",
    cost: "",
    dueDate: "",
  }
}

export function createProductCatalogDraft(): ProductCatalogDraft {
  return {
    name: "",
    description: "",
    model: "Produto sob medida",
  }
}

export function createEmptyConversation(clientName: string): Conversation {
  return {
    status: "Aberta",
    messages: [],
  }
}

export function ensureConversations(state: AdminState): AdminState {
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

export function mergeRegisteredClients(state: AdminState, registeredClients: RegisteredClient[]): AdminState {
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

export function applyApiMessagesToConversations(state: AdminState, apiMessages: ApiMessage[]): AdminState {
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
