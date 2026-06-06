import { NextResponse } from "next/server"
import { notifyProjectCreated, notifyProjectStatusChanged } from "@/lib/notifications"
import {
  createProject,
  deleteProject,
  listProjects,
  updateProjectStatus,
  type StoredProject,
} from "@/lib/project-store"

const projectStatuses = ["Aguardando", "Em andamento", "Entregue", "Pausado", "Cancelado"]

function normalizeMoney(value: unknown) {
  const normalizedValue = Number(String(value ?? "0").replace(",", "."))

  if (!Number.isFinite(normalizedValue)) return 0

  return Math.max(0, Math.round(normalizedValue))
}

function parseDueDate(value: unknown) {
  const date = String(value ?? "").trim()

  return date || new Date().toISOString().slice(0, 10)
}

function projectDateToDate(value: string | null | undefined) {
  return value ? new Date(`${value.slice(0, 10)}T12:00:00`) : null
}

function serializeProject(project: StoredProject) {
  return {
    id: project.id,
    userId: project.userId,
    clientId: project.clientId,
    name: project.name,
    type: project.type,
    status: project.status,
    paymentStatus: project.paymentStatus,
    value: project.value,
    cost: project.cost,
    dueDate: project.dueDate,
    description: project.description,
    abacateCheckoutUrl: project.abacateCheckoutUrl,
    paidAt: project.paidAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    client: project.client,
  }
}

function toNotificationProject(project: StoredProject) {
  return {
    id: project.id,
    userId: project.userId,
    name: project.name,
    type: project.type,
    status: project.status,
    paymentStatus: project.paymentStatus,
    value: project.value,
    dueDate: projectDateToDate(project.dueDate),
    user: project.client
      ? {
          id: project.client.id,
          name: project.client.name,
          company: project.client.company,
          email: project.client.email,
        }
      : null,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")?.trim()
  const openForPayment = searchParams.get("openForPayment") === "1"

  const projects = await listProjects({
    ...(userId ? { userId } : {}),
    openForPayment,
  })

  return NextResponse.json({ projects: projects.map(serializeProject) })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId = String(body.userId ?? body.clientId ?? "").trim()
    const name = String(body.name ?? "").trim()
    const type = String(body.type ?? "Produto unico").trim() || "Produto unico"

    if (!userId || !name) {
      return NextResponse.json({ message: "Informe cliente e nome do projeto." }, { status: 400 })
    }

    const project = await createProject({
      userId,
      name,
      type,
      value: normalizeMoney(body.value),
      cost: normalizeMoney(body.cost),
      dueDate: parseDueDate(body.dueDate),
      client: {
        id: userId,
        name: String(body.clientName ?? "").trim(),
        company: String(body.clientCompany ?? "").trim(),
        email: String(body.clientEmail ?? "").trim(),
      },
    })

    if (!project) {
      return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
    }

    try {
      await notifyProjectCreated(toNotificationProject(project))
    } catch {
      // Project creation should not depend on notification delivery.
    }

    return NextResponse.json({ ok: true, project: serializeProject(project) })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const id = String(body.id ?? "").trim()
    const status = String(body.status ?? "").trim()

    if (!id || !status) {
      return NextResponse.json({ message: "Informe projeto e status." }, { status: 400 })
    }

    if (!projectStatuses.includes(status)) {
      return NextResponse.json({ message: "Status invalido." }, { status: 400 })
    }

    const result = await updateProjectStatus(id, status)

    if (!result) {
      return NextResponse.json({ message: "Projeto nao encontrado." }, { status: 404 })
    }

    try {
      await notifyProjectStatusChanged(toNotificationProject(result.project), result.previousStatus)
    } catch {
      // Status updates should not depend on notification delivery.
    }

    return NextResponse.json({ ok: true, project: serializeProject(result.project) })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const id = String(body.id ?? "").trim()

    if (!id) {
      return NextResponse.json({ message: "Informe o projeto." }, { status: 400 })
    }

    const deleted = await deleteProject(id)

    if (!deleted) {
      return NextResponse.json({ message: "Projeto nao encontrado." }, { status: 404 })
    }

    return NextResponse.json({ ok: true, deletedId: id })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
