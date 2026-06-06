import { NextResponse } from "next/server"
import { hashPassword, verifyPassword } from "@/lib/password"
import { getUserByEmail, serializeAuthUser, updateUserPasswordHash } from "@/lib/user-store"
import { normalizeEmail } from "@/lib/users"

const adminCredentials = {
  password: "nevesany1234",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (password === adminCredentials.password) {
      return NextResponse.json({
        ok: true,
        message: "Login administrativo bem-sucedido",
        redirectTo: "/admin",
        user: {
          id: "admin",
          name: "Administrador",
          email: "Admin1234",
          role: "admin",
        },
      })
    }

    if (!email || !password) {
      return NextResponse.json({ message: "Faltam campos" }, { status: 400 })
    }

    const normalizedEmail = normalizeEmail(email)

    const user = await getUserByEmail(normalizedEmail)

    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json({ message: "Credenciais invalidas" }, { status: 401 })
    }

    if (!user.passwordHash.startsWith("pbkdf2:")) {
      await updateUserPasswordHash(user.id, hashPassword(String(password)))
    }

    return NextResponse.json({
      ok: true,
      message: "Login bem-sucedido",
      redirectTo: "/cliente",
      user: serializeAuthUser(user),
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
