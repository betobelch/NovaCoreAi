"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react"

type ResetStep = "email" | "verify" | "reset" | "done"
type Status = null | { type: "success" | "error"; message: string }

export default function RecoverPasswordPage() {
  const [step, setStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [resetId, setResetId] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [previewCode, setPreviewCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  async function requestReset(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.message || "Erro ao solicitar redefinicao.")

      setResetId(data.resetId)
      setPreviewCode(data.previewCode ?? "")
      setStep("verify")
      setStatus({ type: "success", message: data.message || "Codigo enviado." })
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Erro desconhecido." })
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetId, code }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.message || "Erro ao verificar codigo.")

      setResetToken(data.resetToken)
      setStep("reset")
      setStatus({ type: "success", message: data.message || "E-mail verificado." })
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Erro desconhecido." })
    } finally {
      setIsLoading(false)
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password, passwordConfirm }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.message || "Erro ao redefinir senha.")

      setPassword("")
      setPasswordConfirm("")
      setStep("done")
      setStatus({ type: "success", message: data.message || "Senha redefinida." })
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Erro desconhecido." })
    } finally {
      setIsLoading(false)
    }
  }

  function handleCodeChange(value: string) {
    setCode(value.replace(/\D/g, "").slice(0, 6))
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-lg px-4">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8">
          <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {step === "email" && <Mail className="h-6 w-6" />}
            {step === "verify" && <ShieldCheck className="h-6 w-6" />}
            {step === "reset" && <KeyRound className="h-6 w-6" />}
            {step === "done" && <CheckCircle2 className="h-6 w-6" />}
          </div>

          <h1 className="text-2xl font-semibold mb-2">Recuperar senha</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {step === "email" && "Digite o e-mail cadastrado para receber o codigo de verificacao."}
            {step === "verify" && "Confirme o codigo enviado para o e-mail cadastrado."}
            {step === "reset" && "Crie uma nova senha para acessar sua area de cliente."}
            {step === "done" && "Sua senha foi atualizada. Agora voce ja pode entrar novamente."}
          </p>

          {step === "email" && (
            <form onSubmit={requestReset} className="space-y-4">
              <div>
                <label htmlFor="recover-email" className="block text-sm mb-2">
                  E-mail
                </label>
                <input
                  id="recover-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="seu@email.com"
                />
              </div>
              <button disabled={isLoading} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-60">
                {isLoading ? "Enviando..." : "Enviar codigo"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={verifyCode} className="space-y-4">
              <div>
                <label htmlFor="recover-code" className="block text-sm mb-2">
                  Codigo de verificacao
                </label>
                <input
                  id="recover-code"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="w-full px-4 py-3 border rounded-lg text-center text-xl font-semibold"
                  placeholder="000000"
                />
              </div>

              {previewCode && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  Codigo de teste: <span className="font-semibold">{previewCode}</span>
                </div>
              )}

              <button disabled={isLoading} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-60">
                {isLoading ? "Verificando..." : "Verificar e-mail"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setStep("email")
                  setCode("")
                  setStatus(null)
                }}
                className="w-full px-6 py-3 border border-border bg-background hover:bg-muted text-foreground rounded-lg transition-colors disabled:opacity-60"
              >
                Usar outro e-mail
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={resetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm mb-2">
                  Nova senha
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Senha"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm mb-2">
                  Confirmar nova senha
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Confirmar senha"
                />
              </div>
              <p className="text-xs text-muted-foreground">A senha deve ter no minimo 8 caracteres, com letras e numeros.</p>
              <button disabled={isLoading} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-60">
                {isLoading ? "Salvando..." : "Redefinir senha"}
              </button>
            </form>
          )}

          {step === "done" && (
            <Link href="/login" className="flex w-full items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg">
              Entrar com nova senha
            </Link>
          )}

          {status && <p className={"mt-4 text-sm " + (status.type === "success" ? "text-green-500" : "text-red-500")}>{status.message}</p>}
        </div>
      </div>
    </main>
  )
}
