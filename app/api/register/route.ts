import { NextResponse } from "next/server"
import { notifyClientRegistered } from "@/lib/notifications"
import { normalizeCpf, normalizePhone, validateRegistrationForm } from "@/lib/registration-validation"
import { hashPassword } from "@/lib/password"
import { createUser, getUserByCpf, getUserByEmail, serializeAuthUser, usesBlobUserStore } from "@/lib/user-store"
import { normalizeEmail } from "@/lib/users"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validationMessage = validateRegistrationForm(body)

    if (validationMessage) {
      return NextResponse.json({ message: validationMessage }, { status: 400 })
    }

    const name = String(body.name).trim()
    const company = String(body.company ?? "").trim()
    const phone = normalizePhone(String(body.phone ?? ""))
    const normalizedEmail = normalizeEmail(String(body.email))
    const normalizedCpf = normalizeCpf(String(body.cpf))
    const password = String(body.password)

    if (await getUserByEmail(normalizedEmail)) {
      return NextResponse.json({ message: "E-mail ja cadastrado" }, { status: 409 })
    }

    if (await getUserByCpf(normalizedCpf)) {
      return NextResponse.json({ message: "CPF ja cadastrado" }, { status: 409 })
    }

    const user = await createUser({
      name,
      company,
      cpf: normalizedCpf,
      phone: phone || null,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
    })

    if (!user) {
      return NextResponse.json({ message: "Nao foi possivel criar o cadastro." }, { status: 500 })
    }

    if (!usesBlobUserStore) {
      try {
        await notifyClientRegistered(user)
      } catch {
        // Registration should not depend on notification delivery.
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Cadastro realizado",
      user: serializeAuthUser(user),
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
