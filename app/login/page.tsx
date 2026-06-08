"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Fingerprint,
  Gauge,
  LockKeyhole,
  Mail,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Workflow,
  Zap,
} from "lucide-react"
import { saveClientAuth } from "@/lib/client-auth"
import { GoogleAuthButton } from "@/components/google-auth-button"

const backgroundParticles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 31 + 8) % 100}%`,
  top: `${(index * 47 + 13) % 100}%`,
  size: 2 + (index % 4),
  delay: (index % 10) * 0.28,
  duration: 6 + (index % 7) * 0.6,
  drift: 18 + (index % 6) * 4,
}))

const commandMetrics = [
  {
    label: "Mensagens processadas",
    value: "128k",
    detail: "+18% hoje",
    icon: MessageCircle,
    tone: "from-blue-500 to-cyan-400",
  },
  {
    label: "Automações ativas",
    value: "42",
    detail: "99.8% uptime",
    icon: Workflow,
    tone: "from-violet-500 to-fuchsia-400",
  },
  {
    label: "Tempo de resposta IA",
    value: "0.8s",
    detail: "tempo médio",
    icon: Gauge,
    tone: "from-emerald-400 to-cyan-400",
  },
]

const automationFlow = [
  { label: "Entrada", value: "Lead", icon: MessageCircle },
  { label: "Análise", value: "IA", icon: BrainCircuit },
  { label: "Ação", value: "Fluxo", icon: Zap },
  { label: "Controle", value: "CRM", icon: Cpu },
]

const signalBars = [44, 72, 58, 88, 64, 96, 76, 54, 82, 68]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

export default function LoginPage() {
  const router = useRouter()
  const adminAccessPassword = "nevesany1234"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    event.currentTarget.style.setProperty("--login-mouse-x", `${x.toFixed(2)}%`)
    event.currentTarget.style.setProperty("--login-mouse-y", `${y.toFixed(2)}%`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro no login")
      saveClientAuth(data.user, remember)
      setStatus({ type: "success", message: data.message || "Logado" })
      router.push(data.redirectTo || (data.user?.role === "admin" ? "/admin" : "/cliente"))
    } catch (err: unknown) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Erro desconhecido" })
    }
  }

  function handleGoogleLogin() {
    setStatus({ type: "error", message: "Login com Google estará disponível em breve." })
  }

  return (
    <main
      onPointerMove={handlePointerMove}
      style={{ "--login-mouse-x": "64%", "--login-mouse-y": "28%" } as React.CSSProperties}
      className="login-os-shell relative isolate min-h-screen overflow-hidden px-4 pb-10 pt-28 text-slate-950 sm:px-6 lg:px-8 dark:text-white"
    >
      <div className="login-energy-orbit absolute inset-0" aria-hidden="true" />
      <div className="login-scan-beam absolute inset-x-0 top-0 h-44" aria-hidden="true" />

      {backgroundParticles.map((particle) => (
        <span
          key={particle.id}
          className="login-particle absolute hidden sm:block"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--login-particle-delay": `${particle.delay}s`,
              "--login-particle-duration": `${particle.duration}s`,
              "--login-particle-drift": `${particle.drift}px`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(420px,530px)_minmax(0,1fr)] xl:gap-12"
      >
        <motion.section variants={fadeUp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="login-card group relative overflow-hidden rounded-[2rem] border border-white/[0.55] bg-white/[0.58] p-5 shadow-[0_34px_120px_rgba(37,99,235,0.20)] backdrop-blur-2xl sm:p-8 lg:p-9 dark:border-white/[0.13] dark:bg-slate-950/[0.68] dark:shadow-[0_38px_130px_rgba(0,0,0,0.46)]">
            <div className="relative z-10">
              <div className="mb-8 flex items-start gap-4">
                <motion.div
                  animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                  className="login-holo-icon nova-logo-mark flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-violet-500 text-white shadow-[0_18px_46px_rgba(37,99,235,0.34)]"
                >
                  <Bot className="relative z-10 h-7 w-7" />
                </motion.div>
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-white/[0.52] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-blue-700 shadow-[0_10px_32px_rgba(37,99,235,0.10)] backdrop-blur dark:border-cyan-300/20 dark:bg-white/[0.08] dark:text-cyan-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)]" />
                    Core OS seguro
                  </div>
                  <h1 className="max-w-md text-3xl font-black leading-tight text-slate-950 sm:text-4xl dark:text-white">
                    Acesse o núcleo da automação
                  </h1>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-600 dark:text-slate-300">
                    Controle inteligente para empresas modernas
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <GoogleAuthButton
                  label="Entrar com Google"
                  onUnavailable={handleGoogleLogin}
                  className="login-google-button min-h-12 rounded-2xl border-white/60 bg-white/[0.58] text-slate-800 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl hover:border-blue-300/[0.70] hover:bg-white/[0.78] hover:text-slate-950 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:hover:border-cyan-300/35 dark:hover:bg-white/[0.12]"
                />
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300/80 to-violet-300/80 dark:via-cyan-300/40 dark:to-violet-300/40" />
                  <span>acesso por e-mail</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-violet-300/80 via-blue-300/80 to-transparent dark:from-violet-300/40 dark:via-cyan-300/40" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    E-mail corporativo
                  </label>
                  <div className="group/input relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-blue-600 dark:text-slate-500 dark:group-focus-within/input:text-cyan-300" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={password !== adminAccessPassword}
                      inputMode="email"
                      autoComplete="email"
                      placeholder="voce@empresa.com.br"
                      className="login-input min-h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-4 py-3 pl-12 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/[0.72] focus:ring-4 focus:ring-blue-400/[0.18] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300 dark:focus:bg-white/[0.10] dark:focus:ring-cyan-300/[0.16]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="login-password" className="block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Senha neural
                    </label>
                    <Link
                      href="/login/recuperar-senha"
                      className="text-sm font-black text-blue-700 transition-colors hover:text-violet-700 dark:text-cyan-200 dark:hover:text-violet-200"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <div className="group/input relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-blue-600 dark:text-slate-500 dark:group-focus-within/input:text-cyan-300" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      className="login-input min-h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-4 py-3 pl-12 pr-12 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/[0.72] focus:ring-4 focus:ring-blue-400/[0.18] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300 dark:focus:bg-white/[0.10] dark:focus:ring-cyan-300/[0.16]"
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
                  </div>
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
                    Lembrar sessão
                  </label>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-emerald-600 dark:text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                    acesso criptografado
                  </span>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  className="login-primary-button mt-2 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 px-6 py-3 text-base font-black text-white shadow-[0_22px_58px_rgba(37,99,235,0.32)] transition-all"
                >
                  Entrar no núcleo
                  <ArrowRight className="h-5 w-5" />
                </motion.button>

                <Link
                  href="/cliente/cadastrar"
                  className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/[0.44] px-6 py-3 text-sm font-black text-slate-800 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:border-blue-300/[0.70] hover:bg-white/[0.72] hover:text-blue-700 hover:shadow-[0_18px_48px_rgba(37,99,235,0.14)] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-white dark:hover:border-cyan-300/35 dark:hover:bg-white/[0.12] dark:hover:text-cyan-200"
                >
                  <UserPlus className="h-4 w-4" />
                  Criar cadastro
                </Link>

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
        </motion.section>

        <motion.aside
          variants={fadeUp}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
          aria-label="Painel de métricas NovaCore AI"
        >
          <div className="login-side-panel relative overflow-hidden rounded-[2rem] border border-white/[0.45] bg-white/40 p-6 shadow-[0_38px_130px_rgba(37,99,235,0.18)] backdrop-blur-2xl xl:p-7 dark:border-white/[0.13] dark:bg-slate-950/[0.58] dark:shadow-[0_38px_130px_rgba(0,0,0,0.45)]">
            <div className="relative z-10">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300 shadow-[0_18px_42px_rgba(15,23,42,0.20)]">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700 dark:text-cyan-200">NovaCore Command</p>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">Painel operacional IA</h2>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-300/[0.14] px-3 py-1.5 text-xs font-black text-emerald-700">
                  <Radio className="h-3.5 w-3.5" />
                  Live
                </div>
              </div>

              <div className="grid gap-3">
                {commandMetrics.map((metric, index) => {
                  const Icon = metric.icon

                  return (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.55, delay: 0.35 + index * 0.1 }}
                      className="group/metric grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-white/[0.48] bg-white/[0.38] px-4 py-3 shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-blue-300/[0.70] hover:bg-white/[0.58] hover:shadow-[0_18px_48px_rgba(37,99,235,0.14)] dark:border-white/[0.12] dark:bg-white/[0.07] dark:hover:border-cyan-300/30 dark:hover:bg-white/[0.11]"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${metric.tone} text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)]`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <strong className="block truncate text-sm font-black text-slate-950 dark:text-white">{metric.label}</strong>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{metric.detail}</span>
                      </div>
                      <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{metric.value}</span>
                    </motion.div>
                  )
                })}
              </div>

              <div className="my-7 rounded-2xl border border-white/[0.42] bg-slate-950/[0.88] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">Energia IA</span>
                    <h3 className="mt-1 text-lg font-black">Processamento em tempo real</h3>
                  </div>
                  <Activity className="h-5 w-5 text-cyan-300" />
                </div>

                <div className="flex h-24 items-end gap-2">
                  {signalBars.map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="login-signal-bar flex-1 rounded-t-full bg-gradient-to-t from-blue-600 via-cyan-400 to-white/90"
                      style={
                        {
                          height: `${height}%`,
                          "--login-bar-delay": `${index * 0.12}s`,
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl border border-white/[0.42] bg-white/[0.36] p-5 dark:border-white/[0.12] dark:bg-white/[0.07]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-violet-700 dark:text-violet-200">Fluxo visual</span>
                    <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Automação conectada</h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-violet-600" />
                </div>

                <div className="relative grid grid-cols-4 gap-3">
                  <span className="absolute left-[8%] right-[8%] top-6 h-px bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500" aria-hidden="true" />
                  {automationFlow.map((node, index) => {
                    const Icon = node.icon

                    return (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, y: 14, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.7 + index * 0.09 }}
                        className="relative z-10 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/[0.72] text-blue-700 shadow-[0_14px_34px_rgba(37,99,235,0.12)] dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <strong className="mt-3 block text-xs font-black uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                          {node.label}
                        </strong>
                        <span className="mt-1 block text-sm font-black text-slate-950 dark:text-white">{node.value}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </main>
  )
}
