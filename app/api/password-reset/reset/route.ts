import { NextResponse } from "next/server"
import { resetPasswordWithToken } from "@/lib/password-reset"
import { validatePassword } from "@/lib/registration-validation"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resetToken = String(body.resetToken ?? "")
    const password = String(body.password ?? "")
    const passwordConfirm = String(body.passwordConfirm ?? "")
    const validationMessage = validatePassword(password, passwordConfirm)

    if (!resetToken) {
      return NextResponse.json({ message: "Verifique o e-mail antes de redefinir a senha." }, { status: 400 })
    }

    if (validationMessage) {
      return NextResponse.json({ message: validationMessage }, { status: 400 })
    }

    const user = await resetPasswordWithToken(resetToken, password)

    if (!user) {
      return NextResponse.json({ message: "Solicitacao expirada. Peca um novo codigo." }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: "Senha redefinida com sucesso.",
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
