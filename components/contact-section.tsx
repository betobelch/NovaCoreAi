"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Mail, MapPin } from "lucide-react"
import { getClientAuth, saveClientAuth } from "@/lib/client-auth"
import { formatCpf, validateRegistrationForm } from "@/lib/registration-validation"

export function ContactSection() {
  const router = useRouter()
  const [shouldShowSection, setShouldShowSection] = useState(false)
  const [form, setForm] = useState({ name: "", company: "", cpf: "", email: "", password: "", passwordConfirm: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  useEffect(() => {
    setShouldShowSection(!getClientAuth())
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    const validationMessage = validateRegistrationForm(form)
    if (validationMessage) {
      setStatus({ type: "error", message: validationMessage })
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erro no cadastro')
      saveClientAuth(data.user, remember)
      setStatus({ type: 'success', message: data.message || 'Cadastro realizado' })
      setForm({ name: "", company: "", cpf: "", email: "", password: "", passwordConfirm: "" })
      router.push('/cliente')
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro desconhecido' })
    }
  }

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: key === "cpf" ? formatCpf(value) : value }))
  }

  if (!shouldShowSection) return null

  return (
    <section id="cadastro" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/24 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* CTA Content */}
          <div>
            <span className="text-primary font-black text-sm uppercase">Cadastro</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mt-4 mb-6 text-balance">
              Comece com a NovaCore AI
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Crie sua conta para acessar agentes, automações e integrações feitas sob medida.
              Faça login se já for cliente.
            </p>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">E-mail</p>
                  <p className="text-sm">contato@novacoreai.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Localização</p>
                  <p className="text-sm">São Paulo, Brasil</p>
                </div>
              </div>
            </div>

            {/* Action Buttons: Login + Cadastrar */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-card/62 border border-border text-foreground rounded-lg text-lg font-extrabold hover:bg-card hover:border-primary/35 transition-all backdrop-blur-xl"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/cliente/cadastrar"
                className="cinematic-cta inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-lg font-black transition-all shadow-md shadow-primary/20"
              >
                Cadastrar
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Form Card (Cadastro) */}
          <div>
            <div className="premium-card bg-card/58 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-[0_24px_86px_rgba(37,99,235,0.12)]">
              <div className="relative z-10">
              <h3 className="text-xl font-black text-foreground mb-6">Crie sua conta</h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    minLength={5}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    maxLength={80}
                    autoComplete="organization"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-foreground mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={form.cpf}
                    onChange={(e) => updateField('cpf', e.target.value)}
                    required
                    inputMode="numeric"
                    maxLength={14}
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 bottom-3 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-foreground mb-2">
                      Confirmar senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="passwordConfirm"
                      name="passwordConfirm"
                      value={form.passwordConfirm}
                      onChange={(e) => updateField('passwordConfirm', e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 bottom-3 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  A senha deve ter no minimo 8 caracteres, com letras e numeros.
                </p>

                <button
                  type="submit"
                  className="cinematic-cta w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-black transition-all"
                >
                  Cadastrar
                </button>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Lembrar de mim
                </label>
                {status && (
                  <p className={"text-sm mt-2 " + (status.type === 'success' ? 'text-green-500' : 'text-red-500')}>
                    {status.message}
                  </p>
                )}
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
