import { NextResponse } from "next/server"
import { verifyPasswordResetCode } from "@/lib/password-reset"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resetId = String(body.resetId ?? "")
    const code = String(body.code ?? "")

    if (!resetId || !code) {
      return NextResponse.json({ message: "Informe o codigo recebido por e-mail." }, { status: 400 })
    }

    const verification = await verifyPasswordResetCode(resetId, code)

    if (!verification) {
      return NextResponse.json({ message: "Codigo invalido ou expirado." }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: "E-mail verificado.",
      resetToken: verification.resetToken,
      expiresAt: verification.expiresAt,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
