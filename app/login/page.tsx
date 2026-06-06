"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { saveClientAuth } from '@/lib/client-auth'
import { GoogleAuthButton } from '@/components/google-auth-button'

export default function LoginPage() {
  const router = useRouter()
  const adminAccessPassword = 'nevesany1234'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erro no login')
      saveClientAuth(data.user, remember)
      setStatus({ type: 'success', message: data.message || 'Logado' })
      router.push(data.redirectTo || (data.user?.role === 'admin' ? '/admin' : '/cliente'))
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro desconhecido' })
    }
  }

  function handleGoogleLogin() {
    setStatus({ type: 'error', message: 'Login com Google estará disponível em breve.' })
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-md px-4">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
          <div className="mb-5 space-y-3">
            <GoogleAuthButton label="Entrar com Google" onUnavailable={handleGoogleLogin} />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>ou entre com e-mail</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">E-mail</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={password !== adminAccessPassword}
                inputMode="email"
                autoComplete="email"
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm">Senha</label>
                <Link href="/login/recuperar-senha" className="text-sm font-medium text-primary hover:text-primary/80">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Lembrar de mim
            </label>
            <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg">Entrar</button>
            <Link
              href="/cliente/cadastrar"
              className="flex w-full items-center justify-center px-6 py-3 border border-border bg-background hover:bg-muted text-foreground rounded-lg transition-colors"
            >
              Criar cadastro
            </Link>
            {status && <p className={status.type === 'success' ? 'text-green-500' : 'text-red-500'}>{status.message}</p>}
          </form>
        </div>
      </div>
    </main>
  )
}
