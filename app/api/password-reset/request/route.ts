import { NextResponse } from "next/server"
import { createPasswordResetRequest } from "@/lib/password-reset"
import { isValidEmail } from "@/lib/registration-validation"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "").trim()

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Informe um e-mail valido." }, { status: 400 })
    }

    const resetRequest = await createPasswordResetRequest(email)

    if (!resetRequest) {
      return NextResponse.json({ message: "Nao encontramos cadastro com esse e-mail." }, { status: 404 })
    }

    console.info(`[NovaCore] Codigo de redefinicao para ${resetRequest.email}: ${resetRequest.code}`)

    return NextResponse.json({
      ok: true,
      message: "Codigo enviado para o e-mail cadastrado.",
      resetId: resetRequest.id,
      expiresAt: resetRequest.expiresAt,
      previewCode: process.env.NODE_ENV === "production" ? undefined : resetRequest.code,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
