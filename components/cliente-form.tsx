"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  IdCard,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react"
import { saveClientAuth } from "@/lib/client-auth"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { formatCpf, formatPhone, validateRegistrationForm } from "@/lib/registration-validation"

const emptyForm = {
  name: "",
  company: "",
  cpf: "",
  phone: "",
  email: "",
  password: "",
  passwordConfirm: "",
}

type SignupFieldProps = {
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  label: string
}

function SignupField({ children, icon: Icon, label }: SignupFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="group/input relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-blue-600 dark:text-slate-500 dark:group-focus-within/input:text-cyan-300" />
        {children}
      </div>
    </div>
  )
}

export default function ContactFormOnly() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({
      ...s,
      [key]: key === "cpf" ? formatCpf(value) : key === "phone" ? formatPhone(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    const validationMessage = validateRegistrationForm(form)
    if (validationMessage) return setStatus({ type: "error", message: validationMessage })

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro")
      saveClientAuth(data.user, remember)
      setStatus({ type: "success", message: data.message || "Cadastro realizado" })
      setForm(emptyForm)
      router.push("/cliente")
    } catch (err: unknown) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Erro desconhecido" })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoogleRegister() {
    setStatus({ type: "error", message: "Cadastro com Google estará disponível em breve." })
  }

  const inputClassName =
    "signup-input min-h-14 w-full rounded-2xl border border-white/[0.58] bg-white/[0.52] px-4 py-3 pl-12 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.70)] outline-none transition-all placeholder:text-slate-400 hover:border-blue-300/60 focus:border-blue-400 focus:bg-white/[0.74] focus:ring-4 focus:ring-blue-400/[0.18] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-cyan-300/30 dark:focus:border-cyan-300 dark:focus:bg-white/[0.10] dark:focus:ring-cyan-300/[0.16]"

  return (
    <div className="signup-card relative overflow-hidden rounded-[2rem] border border-white/[0.52] bg-white/[0.62] p-5 shadow-[0_38px_130px_rgba(37,99,235,0.22)] backdrop-blur-2xl sm:p-8 lg:p-9 dark:border-white/[0.13] dark:bg-slate-950/[0.66] dark:shadow-[0_38px_130px_rgba(0,0,0,0.45)]">
      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              className="signup-holo-icon nova-logo-mark flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-violet-600 text-white shadow-[0_18px_46px_rgba(37,99,235,0.34)]"
            >
              <Fingerprint className="relative z-10 h-7 w-7" />
            </motion.div>
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-white/[0.52] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-blue-700 shadow-[0_10px_32px_rgba(37,99,235,0.10)] backdrop-blur dark:border-cyan-300/20 dark:bg-white/[0.08] dark:text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)]" />
                Secure AI onboarding
              </div>
              <h1 className="max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl dark:text-white">
                Crie sua identidade NovaCoreAI
              </h1>
              <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-300">
                Entre no núcleo operacional de automação inteligente com uma experiência segura e premium.
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-emerald-300/35 bg-emerald-300/[0.12] px-4 py-3 text-emerald-700 shadow-[0_16px_40px_rgba(16,185,129,0.10)] sm:block dark:border-emerald-300/20 dark:text-emerald-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em]">
              <ShieldCheck className="h-4 w-4" />
              Trust layer
            </div>
            <strong className="mt-1 block text-xl font-black">256-bit</strong>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <GoogleAuthButton
            label="Cadastrar com Google"
            onUnavailable={handleGoogleRegister}
            className="signup-google-button min-h-12 rounded-2xl border-white/60 bg-white/[0.58] text-slate-800 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl hover:border-blue-300/[0.70] hover:bg-white/[0.78] hover:text-slate-950 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:hover:border-cyan-300/35 dark:hover:bg-white/[0.12]"
          />
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300/80 to-violet-300/80 dark:via-cyan-300/40 dark:to-violet-300/40" />
            <span>dados de acesso</span>
            <span className="h-px flex-1 bg-gradient-to-r from-violet-300/80 via-blue-300/80 to-transparent dark:from-violet-300/40 dark:via-cyan-300/40" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <SignupField icon={User} label="Nome completo">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                minLength={5}
                autoComplete="name"
                placeholder="Seu nome"
                className={inputClassName}
              />
            </SignupField>

            <SignupField icon={Building2} label="Empresa">
              <input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                maxLength={80}
                autoComplete="organization"
                placeholder="Nome da empresa"
                className={inputClassName}
              />
            </SignupField>

            <SignupField icon={IdCard} label="CPF">
              <input
                value={form.cpf}
                onChange={(e) => updateField("cpf", e.target.value)}
                required
                inputMode="numeric"
                maxLength={14}
                autoComplete="off"
                placeholder="000.000.000-00"
                className={inputClassName}
              />
            </SignupField>

            <SignupField icon={Phone} label="Telefone">
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                inputMode="tel"
                maxLength={15}
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                className={inputClassName}
              />
            </SignupField>
          </div>

          <SignupField icon={Mail} label="E-mail">
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              className={inputClassName}
            />
          </SignupField>

          <div className="grid gap-4 md:grid-cols-2">
            <SignupField icon={LockKeyhole} label="Senha">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className={`${inputClassName} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-blue-500/10 hover:text-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-400/30 dark:text-slate-400 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </SignupField>

            <SignupField icon={LockKeyhole} label="Confirmar senha">
              <input
                type={showPassword ? "text" : "password"}
                value={form.passwordConfirm}
                onChange={(e) => updateField("passwordConfirm", e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repita sua senha"
                className={`${inputClassName} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-blue-500/10 hover:text-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-400/30 dark:text-slate-400 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </SignupField>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-md border border-blue-300/[0.70] bg-white/[0.52] shadow-inner transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/[0.18] dark:border-cyan-300/30 dark:bg-white/[0.08] dark:checked:border-cyan-400 dark:checked:bg-cyan-400"
                />
                <CheckCircle2 className="pointer-events-none absolute h-3.5 w-3.5 scale-50 text-white opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100 dark:text-slate-950" />
              </span>
              Lembrar de mim
            </label>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-blue-700 dark:text-cyan-200">
              <Sparkles className="h-4 w-4" />
              onboarding seguro
            </span>
          </div>

          <div className="grid gap-3 pt-1 sm:grid-cols-[1fr_auto]">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="signup-primary-button flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 px-6 py-3 text-base font-black text-white shadow-[0_22px_58px_rgba(37,99,235,0.32)] transition-all disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {isSubmitting ? "Criando conta" : "Criar conta"}
            </motion.button>

            <Link
              href="/login"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-white/60 bg-white/[0.44] px-6 py-3 text-sm font-black text-slate-800 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:border-blue-300/[0.70] hover:bg-white/[0.72] hover:text-blue-700 hover:shadow-[0_18px_48px_rgba(37,99,235,0.14)] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:hover:border-cyan-300/35 dark:hover:bg-white/[0.12] dark:hover:text-cyan-200"
            >
              Já tenho conta
            </Link>
          </div>

          {status && (
            <p
              role="status"
              className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                status.type === "success"
                  ? "border-emerald-300/60 bg-emerald-400/[0.12] text-emerald-700 dark:text-emerald-200"
                  : "border-red-300/[0.70] bg-red-400/10 text-red-700 dark:border-red-300/30 dark:text-red-200"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
