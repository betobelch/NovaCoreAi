"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { saveClientAuth } from "@/lib/client-auth"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { formatCpf, formatPhone, validateRegistrationForm } from "@/lib/registration-validation"

export default function ContactFormOnly() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", company: "", cpf: "", phone: "", email: "", password: "", passwordConfirm: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null)

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
    if (validationMessage) return setStatus({ type: 'error', message: validationMessage })

    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erro')
      saveClientAuth(data.user, remember)
      setStatus({ type: 'success', message: data.message || 'Cadastro realizado' })
      setForm({ name: '', company: '', cpf: '', phone: '', email: '', password: '', passwordConfirm: '' })
      router.push('/cliente')
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro desconhecido' })
    }
  }

  function handleGoogleRegister() {
    setStatus({ type: 'error', message: 'Cadastro com Google estará disponível em breve.' })
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8">
      <h3 className="text-2xl font-semibold mb-4">Criar conta</h3>
      <div className="mb-5 space-y-3">
        <GoogleAuthButton label="Cadastrar com Google" onUnavailable={handleGoogleRegister} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>ou preencha seus dados</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Nome completo</label>
          <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required minLength={5} autoComplete="name" className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm mb-2">Empresa (opcional)</label>
          <input value={form.company} onChange={(e) => updateField('company', e.target.value)} maxLength={80} autoComplete="organization" className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm mb-2">CPF</label>
          <input
            value={form.cpf}
            onChange={(e) => updateField('cpf', e.target.value)}
            required
            inputMode="numeric"
            maxLength={14}
            autoComplete="off"
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Telefone (opcional)</label>
          <input
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            inputMode="tel"
            maxLength={15}
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">E-mail</label>
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required autoComplete="email" className="w-full px-4 py-3 border rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Senha"
              className="w-full px-4 py-3 pr-12 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.passwordConfirm}
              onChange={(e) => updateField('passwordConfirm', e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Confirmar senha"
              className="w-full px-4 py-3 pr-12 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">A senha deve ter no minimo 8 caracteres, com letras e numeros.</p>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Lembrar de mim
        </label>
        <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg">Criar conta</button>
        <Link
          href="/login"
          className="flex w-full items-center justify-center px-6 py-3 border border-border bg-background hover:bg-muted text-foreground rounded-lg transition-colors"
        >
          Ja tenho conta
        </Link>
        {status && <p className={status.type === 'success' ? 'text-green-500' : 'text-red-500'}>{status.message}</p>}
      </form>
    </div>
  )
}
