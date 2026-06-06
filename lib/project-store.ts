import { getStore } from "@netlify/blobs"
import { prisma } from "@/lib/prisma"

export type StoredProjectClient = {
  id: string
  name: string
  company: string
  email: string
}

export type StoredProject = {
  id: string
  userId: string
  clientId: string
  name: string
  type: string
  status: string
  paymentStatus: string
  value: number
  cost: number
  dueDate: string
  description: string | null
  abacateProductId: string | null
  abacateCheckoutId: string | null
  abacateCheckoutUrl: string | null
  abacateExternalId: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  client: StoredProjectClient | null
}

type ProjectClientInput = {
  id: string
  name?: string
  company?: string | null
  email?: string
}

type ProjectRecordWithUser = {
  id: string
  userId: string
  name: string
  type: string
  status: string
  paymentStatus: string
  value: number
  cost: number
  dueDate: Date | null
  description: string | null
  abacateProductId: string | null
  abacateCheckoutId: string | null
  abacateCheckoutUrl: string | null
  abacateExternalId: string | null
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string
    company: string | null
    email: string
  } | null
}

const projectStoreKey = "projects"

export const usesBlobProjectStore = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)

function createProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getProjectStore() {
  return getStore("novacore-projects")
}

function currentDateOnly() {
  return new Date().toISOString().slice(0, 10)
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) return null

  return value instanceof Date ? value.toISOString() : value
}

function toDateOnly(value: Date | string | null | undefined) {
  const isoValue = toIsoString(value)

  return isoValue ? isoValue.slice(0, 10) : currentDateOnly()
}

function nullableString(value: unknown) {
  const text = String(value ?? "").trim()

  return text || null
}

function numericValue(value: unknown) {
  const numberValue = Number(value ?? 0)

  return Number.isFinite(numberValue) ? numberValue : 0
}

function parseDueDate(value: string) {
  return value ? new Date(`${value}T12:00:00`) : new Date()
}

function sortProjects(projects: StoredProject[]) {
  return [...projects].sort((first, second) => second.createdAt.localeCompare(first.createdAt))
}

function normalizeClient(userId: string, client?: ProjectClientInput | null): StoredProjectClient | null {
  if (!client?.id && !client?.name && !client?.email && !client?.company) return null

  return {
    id: client.id || userId,
    name: client.name?.trim() || "Cliente",
    company: client.company?.trim() || "",
    email: client.email?.trim() || "",
  }
}

function normalizeBlobProject(project: any): StoredProject | null {
  const id = String(project?.id ?? "").trim()
  const userId = String(project?.userId ?? project?.clientId ?? "").trim()
  const name = String(project?.name ?? "").trim()

  if (!id || !userId || !name) return null

  return {
    id,
    userId,
    clientId: userId,
    name,
    type: String(project?.type ?? "Produto unico").trim() || "Produto unico",
    status: String(project?.status ?? "Aguardando").trim() || "Aguardando",
    paymentStatus: String(project?.paymentStatus ?? "Pendente").trim() || "Pendente",
    value: numericValue(project?.value),
    cost: numericValue(project?.cost),
    dueDate: toDateOnly(project?.dueDate),
    description: nullableString(project?.description),
    abacateProductId: nullableString(project?.abacateProductId),
    abacateCheckoutId: nullableString(project?.abacateCheckoutId),
    abacateCheckoutUrl: nullableString(project?.abacateCheckoutUrl),
    abacateExternalId: nullableString(project?.abacateExternalId),
    paidAt: toIsoString(project?.paidAt),
    createdAt: toIsoString(project?.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoString(project?.updatedAt) ?? new Date().toISOString(),
    client: normalizeClient(userId, {
      id: String(project?.client?.id ?? userId),
      name: String(project?.client?.name ?? "").trim(),
      company: String(project?.client?.company ?? "").trim(),
      email: String(project?.client?.email ?? "").trim(),
    }),
  }
}

function mapPrismaProject(project: ProjectRecordWithUser): StoredProject {
  return {
    id: project.id,
    userId: project.userId,
    clientId: project.userId,
    name: project.name,
    type: project.type,
    status: project.status,
    paymentStatus: project.paymentStatus,
    value: project.value,
    cost: project.cost,
    dueDate: toDateOnly(project.dueDate),
    description: project.description,
    abacateProductId: project.abacateProductId,
    abacateCheckoutId: project.abacateCheckoutId,
    abacateCheckoutUrl: project.abacateCheckoutUrl,
    abacateExternalId: project.abacateExternalId,
    paidAt: project.paidAt?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    client: project.user
      ? {
          id: project.user.id,
          name: project.user.name,
          company: project.user.company ?? "",
          email: project.user.email,
        }
      : null,
  }
}

function filterProjects(
  projects: StoredProject[],
  options: {
    userId?: string
    openForPayment?: boolean
  } = {},
) {
  return sortProjects(
    projects.filter((project) => {
      if (options.userId && project.userId !== options.userId) return false

      if (options.openForPayment) {
        return project.paymentStatus === "Pendente" && project.value > 0 && project.status !== "Cancelado"
      }

      return true
    }),
  )
}

async function readPrismaProjects() {
  const projects = await prisma.project.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return projects.map(mapPrismaProject)
}

async function readBlobProjects() {
  const storedProjects = await getProjectStore().get(projectStoreKey, { type: "json" })

  if (Array.isArray(storedProjects)) {
    return sortProjects(storedProjects.map(normalizeBlobProject).filter(Boolean) as StoredProject[])
  }

  try {
    const seededProjects = await readPrismaProjects()

    if (seededProjects.length > 0) {
      await writeBlobProjects(seededProjects)
    }

    return seededProjects
  } catch {
    return []
  }
}

async function writeBlobProjects(projects: StoredProject[]) {
  await getProjectStore().setJSON(projectStoreKey, sortProjects(projects))
}

export async function listProjects(options: { userId?: string; openForPayment?: boolean } = {}) {
  if (usesBlobProjectStore) {
    return filterProjects(await readBlobProjects(), options)
  }

  return filterProjects(await readPrismaProjects(), options)
}

export async function createProject(input: {
  userId: string
  name: string
  type: string
  value: number
  cost: number
  dueDate: string
  client?: ProjectClientInput | null
}) {
  if (usesBlobProjectStore) {
    const projects = await readBlobProjects()
    const now = new Date().toISOString()
    const client = normalizeClient(input.userId, input.client)
    const project: StoredProject = {
      id: createProjectId(),
      userId: input.userId,
      clientId: input.userId,
      name: input.name,
      type: input.type || "Produto unico",
      status: "Aguardando",
      paymentStatus: "Pendente",
      value: input.value,
      cost: input.cost,
      dueDate: toDateOnly(input.dueDate),
      description: null,
      abacateProductId: null,
      abacateCheckoutId: null,
      abacateCheckoutUrl: null,
      abacateExternalId: null,
      paidAt: null,
      createdAt: now,
      updatedAt: now,
      client,
    }

    await writeBlobProjects([project, ...projects])

    return project
  }

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
    },
  })

  if (!user) return null

  const project = await prisma.project.create({
    data: {
      userId: input.userId,
      name: input.name,
      type: input.type || "Produto unico",
      value: input.value,
      cost: input.cost,
      dueDate: parseDueDate(input.dueDate),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
  })

  return mapPrismaProject(project)
}

export async function getProject(projectId: string) {
  if (usesBlobProjectStore) {
    return (await readBlobProjects()).find((project) => project.id === projectId) ?? null
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
  })

  return project ? mapPrismaProject(project) : null
}

export async function updateProjectStatus(projectId: string, status: string) {
  if (usesBlobProjectStore) {
    const projects = await readBlobProjects()
    const currentProject = projects.find((project) => project.id === projectId)

    if (!currentProject) return null

    const previousStatus = currentProject.status
    const updatedProject = {
      ...currentProject,
      status,
      updatedAt: new Date().toISOString(),
    }

    await writeBlobProjects(projects.map((project) => (project.id === projectId ? updatedProject : project)))

    return { project: updatedProject, previousStatus }
  }

  const currentProject = await prisma.project.findUnique({
    where: { id: projectId },
    select: { status: true },
  })

  if (!currentProject) return null

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
  })

  return { project: mapPrismaProject(project), previousStatus: currentProject.status }
}

export async function deleteProject(projectId: string) {
  if (usesBlobProjectStore) {
    const projects = await readBlobProjects()

    if (!projects.some((project) => project.id === projectId)) return false

    await writeBlobProjects(projects.filter((project) => project.id !== projectId))

    return true
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  })

  if (!project) return false

  await prisma.project.delete({ where: { id: projectId } })

  return true
}

export async function updateProjectCheckout(
  projectId: string,
  input: {
    abacateProductId: string
    abacateCheckoutId: string
    abacateCheckoutUrl: string
    abacateExternalId: string
    paymentStatus: string
    paidAt: string | null
  },
) {
  if (usesBlobProjectStore) {
    const projects = await readBlobProjects()
    const currentProject = projects.find((project) => project.id === projectId)

    if (!currentProject) return null

    const updatedProject: StoredProject = {
      ...currentProject,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    await writeBlobProjects(projects.map((project) => (project.id === projectId ? updatedProject : project)))

    return updatedProject
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      abacateProductId: input.abacateProductId,
      abacateCheckoutId: input.abacateCheckoutId,
      abacateCheckoutUrl: input.abacateCheckoutUrl,
      abacateExternalId: input.abacateExternalId,
      paymentStatus: input.paymentStatus,
      paidAt: input.paidAt ? new Date(input.paidAt) : null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
  })

  return mapPrismaProject(project)
}

export async function updateProjectsPaymentByCheckout(input: {
  checkoutId: string
  externalId?: string | null
  paymentStatus: string
  checkoutUrl?: string | null
}) {
  if (usesBlobProjectStore) {
    const projects = await readBlobProjects()
    const now = new Date().toISOString()
    const matches = projects.filter(
      (project) =>
        project.abacateCheckoutId === input.checkoutId ||
        Boolean(input.externalId && project.abacateExternalId === input.externalId),
    )

    if (matches.length === 0) return []

    const updatedProjects = projects.map((project) => {
      const isMatch = matches.some((match) => match.id === project.id)

      if (!isMatch) return project

      return {
        ...project,
        paymentStatus: input.paymentStatus,
        abacateCheckoutUrl: input.checkoutUrl ?? project.abacateCheckoutUrl,
        paidAt: input.paymentStatus === "Pago" ? now : project.paidAt,
        updatedAt: now,
      }
    })

    await writeBlobProjects(updatedProjects)

    return matches.map((project) => ({
      previousPaymentStatus: project.paymentStatus,
      project: updatedProjects.find((updatedProject) => updatedProject.id === project.id) ?? project,
    }))
  }

  const where = {
    OR: [
      { abacateCheckoutId: input.checkoutId },
      ...(input.externalId ? [{ abacateExternalId: input.externalId }] : []),
    ],
  }
  const projects = await prisma.project.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
        },
      },
    },
  })

  if (projects.length === 0) return []

  await prisma.project.updateMany({
    where,
    data: {
      paymentStatus: input.paymentStatus,
      abacateCheckoutUrl: input.checkoutUrl ?? undefined,
      paidAt: input.paymentStatus === "Pago" ? new Date() : undefined,
    },
  })

  return projects.map((project) => {
    const mappedProject = mapPrismaProject(project)

    return {
      previousPaymentStatus: project.paymentStatus,
      project: {
        ...mappedProject,
        paymentStatus: input.paymentStatus,
        abacateCheckoutUrl: input.checkoutUrl ?? mappedProject.abacateCheckoutUrl,
        paidAt: input.paymentStatus === "Pago" ? new Date().toISOString() : mappedProject.paidAt,
      },
    }
  })
}
