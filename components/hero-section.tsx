"use client"

import type { MouseEvent } from "react"
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
  Database,
  MessageCircle,
  Radio,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react"
import { getClientAuth } from "@/lib/client-auth"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const heroMetrics = [
  { label: "Leads qualificados", value: "312", tone: "from-primary to-sky-400" },
  { label: "Tempo economizado", value: "64h", tone: "from-emerald-400 to-cyan-400" },
  { label: "Fluxos ativos", value: "18", tone: "from-accent to-fuchsia-400" },
]

const workflowNodes = [
  { icon: MessageCircle, label: "WhatsApp", status: "Entrada" },
  { icon: BrainCircuit, label: "IA entende", status: "Analise" },
  { icon: Database, label: "CRM", status: "Registro" },
  { icon: CheckCircle2, label: "Equipe", status: "Acao" },
]

export function HeroSection() {
  const router = useRouter()

  function handleSolicitarIaClick(event: MouseEvent<HTMLAnchorElement>) {
    const clientUser = getClientAuth()

    if (!clientUser || clientUser.role === "admin") return

    event.preventDefault()
    router.push("/cliente?tab=produtos#painel")
  }

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100vh+64px)] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-center lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/58 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-[0_16px_44px_rgba(37,99,235,0.10)] backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Agente NovaCore online para operar 24/7
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-black leading-[1.04] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Sua empresa com uma{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-transparent">
              IA operacional
            </span>{" "}
            que atende, vende e organiza.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl lg:mx-0"
          >
            A NovaCore AI cria agentes, automacoes e integracoes que conectam atendimento, CRM, agenda e vendas em um
            fluxo inteligente para sua equipe focar no que gera resultado.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                onClick={handleSolicitarIaClick}
                className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-black text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 sm:text-lg"
              >
                Solicite sua IA
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#servicos"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-border bg-card/62 px-8 py-4 text-base font-extrabold text-foreground backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-card sm:text-lg"
              >
                Conhecer servicos
                <Sparkles className="h-5 w-5 text-primary" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-border bg-card/52 p-4 text-left shadow-[0_18px_54px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${metric.tone}`} />
                <strong className="block text-2xl font-black text-foreground">{metric.value}</strong>
                <span className="mt-1 block text-sm font-bold text-muted-foreground">{metric.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[620px] lg:min-h-[680px]"
        >
          <motion.div
            className="absolute right-2 top-1 z-20 hidden rounded-full border border-emerald-400/20 bg-card/78 px-4 py-2 text-sm font-extrabold text-emerald-500 shadow-[0_18px_42px_rgba(16,185,129,0.12)] backdrop-blur-xl sm:flex"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="mr-2 h-4 w-4" />
            IA pensando em tempo real
          </motion.div>

          <motion.div
            className="absolute -left-3 top-24 z-20 hidden rounded-xl border border-primary/20 bg-card/72 px-4 py-3 shadow-[0_18px_54px_rgba(37,99,235,0.16)] backdrop-blur-xl md:block"
            animate={{ x: [0, 8, 0], y: [0, -6, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-sm font-black text-foreground">Follow-up automatico</strong>
                <span className="text-xs font-bold text-muted-foreground">Lead recebeu resposta</span>
              </div>
            </div>
          </motion.div>

          <div className="premium-card relative mx-auto mt-8 overflow-hidden rounded-[28px] border border-border bg-card/58 p-4 shadow-[0_34px_120px_rgba(37,99,235,0.18)] backdrop-blur-2xl sm:p-5">
            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/48 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="nova-logo-mark flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-cyan-400 to-accent">
                    <Bot className="relative z-10 h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-foreground sm:text-base">NovaCore Command Center</h2>
                    <p className="text-xs font-bold text-muted-foreground">Atendimento, CRM e automacao conectados</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-500 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
                  Online
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-2xl border border-border bg-background/46 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-primary">Agente NovaCore</span>
                      <h3 className="mt-1 text-lg font-black text-foreground">Atendimento vivo</h3>
                    </div>
                    <Activity className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.55 }}
                      className="ml-auto max-w-[86%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm font-bold leading-6 text-primary-foreground"
                    >
                      Quero saber qual IA resolve meu atendimento.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.85 }}
                      className="max-w-[92%] rounded-2xl rounded-tl-md border border-border bg-card/82 px-4 py-3 text-sm font-bold leading-6 text-foreground"
                    >
                      Posso mapear seu processo, qualificar leads, criar agendamentos e enviar tudo ao CRM.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.15 }}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-black text-primary"
                    >
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-primary" />
                      IA preparando diagnostico
                    </motion.div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-border bg-background/46 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-primary">Fluxo operacional</span>
                      <h3 className="mt-1 text-lg font-black text-foreground">Automacoes acontecendo</h3>
                    </div>
                    <Workflow className="h-5 w-5 text-primary" />
                  </div>

                  <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 420 260" fill="none">
                    <path
                      className="data-flow-line"
                      d="M60 82 C136 28 234 32 330 78"
                      stroke="url(#flowA)"
                      strokeWidth="2"
                    />
                    <path
                      className="data-flow-line"
                      d="M70 178 C152 232 246 228 342 174"
                      stroke="url(#flowB)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="flowA" x1="60" x2="330" y1="82" y2="78">
                        <stop stopColor="var(--primary)" />
                        <stop offset="1" stopColor="#14b8a6" />
                      </linearGradient>
                      <linearGradient id="flowB" x1="70" x2="342" y1="178" y2="174">
                        <stop stopColor="#14b8a6" />
                        <stop offset="1" stopColor="var(--accent)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="relative z-10 grid grid-cols-2 gap-3">
                    {workflowNodes.map((node, index) => (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.72 + index * 0.12 }}
                        className="rounded-xl border border-border bg-card/82 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <node.icon className="h-5 w-5" />
                        </div>
                        <strong className="block text-sm font-black text-foreground">{node.label}</strong>
                        <span className="mt-1 block text-xs font-extrabold text-muted-foreground">{node.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric, index) => (
                  <div key={metric.label} className="rounded-2xl border border-border bg-background/46 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-muted-foreground">{metric.label}</span>
                      <Cpu className="h-4 w-4 text-primary" />
                    </div>
                    <strong className="text-xl font-black text-foreground">{metric.value}</strong>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={`h-full origin-left rounded-full bg-gradient-to-r ${metric.tone}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.95 + index * 0.12, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
