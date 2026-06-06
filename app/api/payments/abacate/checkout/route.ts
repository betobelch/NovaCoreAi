import { NextResponse } from "next/server"
import {
  AbacatePayError,
  createAbacateCheckout,
  createAbacateProduct,
  getAbacateProductByExternalId,
  getProjectCheckoutExternalId,
  getProjectProductExternalId,
  projectValueToCents,
} from "@/lib/abacate-pay"
import { notifyPaymentStatusChanged } from "@/lib/notifications"
import { getProject, updateProjectCheckout, usesBlobProjectStore, type StoredProject } from "@/lib/project-store"

function getSiteUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(req.url).origin
}

function serializePaymentProject(project: StoredProject) {
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status,
    paymentStatus: project.paymentStatus,
    value: project.value,
    dueDate: project.dueDate,
    abacateCheckoutUrl: project.abacateCheckoutUrl,
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
    dueDate: project.dueDate ? new Date(`${project.dueDate}T12:00:00`) : null,
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const projectId = String(body.projectId ?? "").trim()
    const userId = String(body.userId ?? "").trim()

    if (!projectId || !userId) {
      return NextResponse.json({ message: "Informe o projeto e o cliente." }, { status: 400 })
    }

    const project = await getProject(projectId)

    if (!project || project.userId !== userId) {
      return NextResponse.json({ message: "Projeto nao encontrado para este cliente." }, { status: 404 })
    }

    if (project.status === "Cancelado") {
      return NextResponse.json({ message: "Este projeto esta cancelado." }, { status: 400 })
    }

    if (project.paymentStatus === "Pago") {
      return NextResponse.json({ message: "Este projeto ja esta pago." }, { status: 400 })
    }

    if (project.value <= 0) {
      return NextResponse.json({ message: "Este projeto nao possui valor para pagamento." }, { status: 400 })
    }

    if (project.abacateCheckoutUrl && project.paymentStatus === "Pendente") {
      return NextResponse.json({
        ok: true,
        url: project.abacateCheckoutUrl,
        project: serializePaymentProject(project),
      })
    }

    const productExternalId = getProjectProductExternalId(project.id)
    const checkoutExternalId = getProjectCheckoutExternalId(project.id)
    const existingProduct = project.abacateProductId
      ? null
      : await getAbacateProductByExternalId(productExternalId)
    const product =
      existingProduct ??
      (project.abacateProductId
        ? { id: project.abacateProductId }
        : await createAbacateProduct({
            externalId: productExternalId,
            name: project.name,
            description: `Projeto NovaCore AI para ${project.client?.name || "Cliente"}`,
            price: projectValueToCents(project.value),
          }))

    const siteUrl = getSiteUrl(req)
    const paymentReturnUrl = `${siteUrl}/cliente?tab=pagamento`
    const checkout = await createAbacateCheckout({
      productId: product.id,
      externalId: checkoutExternalId,
      returnUrl: paymentReturnUrl,
      completionUrl: paymentReturnUrl,
      metadata: {
        projectId: project.id,
        userId: project.userId,
        customerEmail: project.client?.email ?? "",
      },
    })

    const updatedProject = await updateProjectCheckout(project.id, {
      abacateProductId: product.id,
      abacateCheckoutId: checkout.id,
      abacateCheckoutUrl: checkout.url,
      abacateExternalId: checkoutExternalId,
      paymentStatus: checkout.status === "PAID" ? "Pago" : "Pendente",
      paidAt: checkout.status === "PAID" ? new Date().toISOString() : null,
    })

    if (!updatedProject) {
      return NextResponse.json({ message: "Projeto nao encontrado para este cliente." }, { status: 404 })
    }

    if (!usesBlobProjectStore) {
      try {
        await notifyPaymentStatusChanged(toNotificationProject(updatedProject), project.paymentStatus)
      } catch {
        // Checkout creation should not depend on notification delivery.
      }
    }

    return NextResponse.json({
      ok: true,
      url: checkout.url,
      checkoutId: checkout.id,
      project: serializePaymentProject(updatedProject),
    })
  } catch (err: any) {
    if (err instanceof AbacatePayError) {
      return NextResponse.json({ message: err.message }, { status: err.status >= 500 ? 502 : err.status })
    }

    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
