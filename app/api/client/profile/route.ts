import { NextResponse } from "next/server"
import { normalizePhone, validateOptionalPhone } from "@/lib/registration-validation"
import { getUserById, serializeAuthUser, updateUserPhone, type StoredUser } from "@/lib/user-store"

function serializeUser(user: StoredUser) {
  return serializeAuthUser(user)
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const userId = String(body.userId ?? "").trim()
    const phoneInput = String(body.phone ?? "")
    const phoneValidationMessage = validateOptionalPhone(phoneInput)

    if (!userId) {
      return NextResponse.json({ message: "Cliente nao informado." }, { status: 400 })
    }

    if (phoneValidationMessage) {
      return NextResponse.json({ message: phoneValidationMessage }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user || user.role !== "client") {
      return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
    }

    const updatedUser = await updateUserPhone(userId, normalizePhone(phoneInput) || null)

    if (!updatedUser) {
      return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user: serializeUser(updatedUser) })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")?.trim()

  if (!userId) {
    return NextResponse.json({ message: "Cliente nao informado." }, { status: 400 })
  }

  const user = await getUserById(userId)

  if (!user || user.role !== "client") {
    return NextResponse.json({ message: "Cliente nao encontrado." }, { status: 404 })
  }

  return NextResponse.json({ user: serializeUser(user) })
}
