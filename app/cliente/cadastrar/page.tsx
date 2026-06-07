"use client"

import type { CSSProperties, PointerEvent } from "react"
import { motion } from "framer-motion"
import { Activity, BrainCircuit, CheckCircle2, Fingerprint, Radio, ShieldCheck, Sparkles, Zap } from "lucide-react"
import ContactFormOnly from "../../../components/cliente-form"

const signupParticles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29 + 12) % 100}%`,
  top: `${(index * 43 + 17) % 100}%`,
  size: 2 + (index % 4),
  delay: (index % 11) * 0.24,
  duration: 6.4 + (index % 7) * 0.6,
  drift: 18 + (index % 6) * 5,
}))

const onboardingSignals = [
  { label: "Perfil seguro", value: "KYC", icon: Fingerprint },
  { label: "IA pronta", value: "24/7", icon: BrainCircuit },
  { label: "Fluxo ativo", value: "Live", icon: Zap },
]

const verificationSteps = ["Identidade", "Empresa", "Acesso", "Núcleo"]

export default function ClienteCadastrarPage() {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    event.currentTarget.style.setProperty("--signup-mouse-x", `${x.toFixed(2)}%`)
    event.currentTarget.style.setProperty("--signup-mouse-y", `${y.toFixed(2)}%`)
  }

  return (
    <main
      onPointerMove={handlePointerMove}
      style={{ "--signup-mouse-x": "58%", "--signup-mouse-y": "24%" } as CSSProperties}
      className="signup-os-shell relative isolate min-h-screen overflow-hidden px-4 pb-12 pt-28 text-slate-950 sm:px-6 lg:px-8 dark:text-white"
    >
      <div className="signup-depth-lines absolute inset-0" aria-hidden="true" />
      <div className="signup-noise-layer absolute inset-0" aria-hidden="true" />
      <div className="signup-scan-beam absolute inset-x-0 top-0 h-48" aria-hidden="true" />

      {signupParticles.map((particle) => (
        <span
          key={particle.id}
          className="signup-particle absolute hidden sm:block"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--signup-particle-delay": `${particle.delay}s`,
              "--signup-particle-duration": `${particle.duration}s`,
              "--signup-particle-drift": `${particle.drift}px`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.62fr)]">
        <motion.section
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-4xl"
        >
          <ContactFormOnly />
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="signup-orchestration-panel relative hidden overflow-hidden rounded-[2rem] border border-white/[0.16] bg-slate-950/[0.78] p-6 text-white shadow-[0_38px_130px_rgba(37,99,235,0.22)] backdrop-blur-2xl lg:block"
          aria-label="Painel de onboarding NovaCore AI"
        >
          <div className="relative z-10">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.10] text-cyan-200 shadow-[0_0_42px_rgba(56,189,248,0.24)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Onboarding Core</p>
                  <h2 className="text-xl font-black">Cadastro inteligente</h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[0.12] px-3 py-1.5 text-xs font-black text-emerald-200">
                <Radio className="h-3.5 w-3.5" />
                Online
              </span>
            </div>

            <div className="grid gap-3">
              {onboardingSignals.map((signal, index) => {
                const Icon = signal.icon

                return (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.34 + index * 0.1 }}
                    className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-white/[0.12] bg-white/[0.075] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/[0.11]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-white shadow-[0_16px_34px_rgba(37,99,235,0.28)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <strong className="truncate text-sm font-black">{signal.label}</strong>
                    <span className="text-lg font-black text-cyan-100">{signal.value}</span>
                  </motion.div>
                )
              })}
            </div>

            <div className="my-7 rounded-2xl border border-white/[0.12] bg-white/[0.07] p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Sequência segura</span>
                <ShieldCheck className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="relative grid grid-cols-4 gap-3">
                <span className="absolute left-[10%] right-[10%] top-5 h-px bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400" aria-hidden="true" />
                {verificationSteps.map((step, index) => (
                  <div key={step} className="relative z-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.12] text-cyan-100 shadow-[0_12px_30px_rgba(37,99,235,0.20)]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="mt-3 block text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-300">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.12] to-white/[0.055] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Core Signal</span>
                  <h3 className="mt-1 text-lg font-black">Identidade validada</h3>
                </div>
                <Activity className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.10]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.65, ease: "easeOut" }}
                  className="h-full origin-left rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-violet-400 shadow-[0_0_28px_rgba(56,189,248,0.45)]"
                />
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  )
}
