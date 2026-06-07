import type { ApiMessage, ChatAttachment, ChatMessage } from "./cliente-types"

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

export function formatDate(date: string) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`))
}

export function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

export function formatNotificationTime(createdAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

export function mapApiMessageToClient(message: ApiMessage): ChatMessage {
  return {
    id: message.id,
    author: message.author === "admin" ? "team" : "client",
    name: message.author === "admin" ? message.name : "Voce",
    text: message.text,
    attachments: message.attachments ?? [],
    time: formatMessageTime(message.createdAt),
  }
}

export function createClientMessage(text: string, attachments: ChatAttachment[] = []): ChatMessage {
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

export function isImageAttachment(attachment: ChatAttachment) {
  return attachment.type.toLowerCase().startsWith("image/") || Boolean(attachment.dataUrl?.startsWith("data:image/"))
}

export function getInitials(name?: string) {
  if (!name) return "CL"

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function getMaskedCpf(cpf?: string) {
  if (!cpf) return "Nao informado"

  return "***.***.***-**"
}
