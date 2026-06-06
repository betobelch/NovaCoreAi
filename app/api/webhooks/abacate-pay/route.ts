import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { notifyPaymentStatusChanged } from "@/lib/notifications"
import { updateProjectsPaymentByCheckout, type StoredProject } from "@/lib/project-store"

const ABACATEPAY_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9"

function verifyAbacateSignature(rawBody: string, signatureFromHeader: string) {
  const expectedSignature = crypto
    .createHmac("sha256", ABACATEPAY_PUBLIC_KEY)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64")

  const expectedBuffer = Buffer.from(expectedSignature)
  const receivedBuffer = Buffer.from(signatureFromHeader)

  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

function getPaymentStatus(event: string, checkoutStatus?: string) {
  if (event === "checkout.refunded" || checkoutStatus === "REFUNDED") return "Reembolsado"
  if (event === "checkout.completed" || checkoutStatus === "PAID") return "Pago"
  if (checkoutStatus === "CANCELLED" || checkoutStatus === "EXPIRED") return "Cancelado"
  if (event === "checkout.disputed") return "Em disputa"

  return null
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
  const configuredSecret = process.env.ABACATEPAY_WEBHOOK_SECRET?.trim()

  if (!configuredSecret) {
    return NextResponse.json({ message: "Webhook da Abacate Pay nao configurado." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)

  if (searchParams.get("webhookSecret") !== configuredSecret) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get("x-webhook-signature") ?? ""

  if (!signature || !verifyAbacateSignature(rawBody, signature)) {
    return NextResponse.json({ message: "Assinatura invalida." }, { status: 401 })
  }

  let payload: any

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ message: "Payload invalido." }, { status: 400 })
  }

  const checkout = payload?.data?.checkout
  const paymentStatus = getPaymentStatus(String(payload?.event ?? ""), checkout?.status)

  if (!checkout?.id || !paymentStatus) {
    return NextResponse.json({ ok: true })
  }

  const updatedProjects = await updateProjectsPaymentByCheckout({
    checkoutId: String(checkout.id),
    externalId: checkout.externalId ? String(checkout.externalId) : null,
    paymentStatus,
    checkoutUrl: checkout.url ? String(checkout.url) : null,
  })

  try {
    await Promise.all(
      updatedProjects.map(({ project, previousPaymentStatus }) =>
        notifyPaymentStatusChanged(toNotificationProject(project), previousPaymentStatus),
      ),
    )
  } catch {
    // Webhook confirmation should not depend on notification delivery.
  }

  return NextResponse.json({ ok: true })
}
