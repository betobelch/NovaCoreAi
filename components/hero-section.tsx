"use client"

import type { MouseEvent } from "react"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  MessageCircle,
  Radio,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react"
import { SoliciteIaLink } from "@/components/solicite-ia-link"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const heroMetrics = [
  { label: "Leads qualificados", value: "+312", helper: "entradas organizadas", width: "88%", tone: "from-cyan-300 to-blue-500" },
  { label: "Tempo economizado", value: "64h", helper: "por mes na operacao", width: "72%", tone: "from-emerald-300 to-cyan-400" },
  { label: "Fluxos ativos", value: "18", helper: "automacoes rodando", width: "81%", tone: "from-violet-300 to-fuchsia-500" },
  { label: "Atendimento automatizado", value: "98%", helper: "respostas imediatas", width: "94%", tone: "from-blue-300 to-cyan-400" },
  { label: "CRM sincronizado", value: "100%", helper: "dados em tempo real", width: "96%", tone: "from-teal-300 to-emerald-400" },
  { label: "Vendas geradas", value: "+R$84k", helper: "pipeline assistido", width: "78%", tone: "from-amber-200 to-cyan-300" },
]

const valueTriggers = ["ganho de tempo", "automacao", "escala", "produtividade", "mais vendas", "menos operacao manual"]

const workflowNodes = [
  { icon: MessageCircle, label: "WhatsApp", status: "Lead recebido", tone: "text-emerald-300" },
  { icon: BrainCircuit, label: "IA entende", status: "Intencao detectada", tone: "text-cyan-300" },
  { icon: Database, label: "CRM", status: "Contato atualizado", tone: "text-blue-300" },
  { icon: Calendar, label: "Agenda", status: "Horario sugerido", tone: "text-violet-300" },
  { icon: Workflow, label: "Follow-up", status: "Sequencia ativa", tone: "text-fuchsia-300" },
  { icon: Users, label: "Vendas", status: "Equipe acionada", tone: "text-amber-200" },
]

const chatMessages = [
  { side: "customer", text: "Quero automatizar meu atendimento e nao perder mais leads." },
  { side: "agent", text: "Perfeito. Vou qualificar a demanda, consultar disponibilidade e registrar tudo no CRM." },
  { side: "agent", text: "Lead quente identificado. Follow-up e proposta enviados automaticamente." },
]

const pipeline = [
  { label: "Novo lead", value: "42", width: "86%" },
  { label: "Qualificado", value: "31", width: "72%" },
  { label: "Reuniao", value: "18", width: "58%" },
  { label: "Proposta", value: "11", width: "44%" },
]

const automations = [
  "WhatsApp conectado",
  "Follow-up automatico",
  "CRM sincronizado",
  "Agenda inteligente",
]

export function HeroSection() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 140, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 140, damping: 22 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7])
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])

  function handleDashboardMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()

    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  function resetDashboardTilt() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section id="home" className="relative isolate overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.06] px-4 py-2 text-sm font-bold text-cyan-50 shadow-[0_18px_58px_rgba(56,189,248,0.16)] backdrop-blur-2xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.95)]" />
            </span>
            Agente NovaCore online para operar 24/7
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-6xl text-4xl font-black leading-[1.02] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Sua empresa com uma{" "}
            <span className="hero-gradient-word bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-300 bg-clip-text text-transparent">
              IA operacional
            </span>{" "}
            que atende, vende e organiza.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            A NovaCore AI cria agentes, automacoes e integracoes que conectam atendimento, CRM, agenda e vendas em um
            fluxo inteligente para sua equipe focar no que gera resultado.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-2">
            {valueTriggers.map((trigger) => (
              <span
                key={trigger}
                className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-black uppercase text-cyan-50/78 shadow-[0_10px_34px_rgba(56,189,248,0.08)] backdrop-blur-xl"
              >
                {trigger}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <SoliciteIaLink className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-black text-primary-foreground shadow-[0_22px_70px_rgba(37,99,235,0.35)] transition hover:bg-primary/90 sm:text-lg">
                Solicite sua IA
                <ArrowRight className="h-5 w-5" />
              </SoliciteIaLink>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#servicos"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.065] px-8 py-4 text-base font-extrabold text-foreground shadow-[0_18px_54px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all hover:border-cyan-300/40 hover:bg-white/[0.095] sm:text-lg"
              >
                Conhecer servicos
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
        >
          {heroMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className="hero-metric-card rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_54px_rgba(2,6,23,0.26)] backdrop-blur-2xl"
            >
              <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${metric.tone}`} style={{ width: metric.width }} />
              <strong className="block text-2xl font-black text-foreground">{metric.value}</strong>
              <span className="mt-1 block text-sm font-black text-foreground/78">{metric.label}</span>
              <small className="mt-1 block text-xs font-bold text-muted-foreground">{metric.helper}</small>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12"
        >
          <motion.div
            className="absolute -right-2 top-2 z-20 hidden rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200 shadow-[0_18px_42px_rgba(16,185,129,0.18)] backdrop-blur-xl sm:flex"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="mr-2 h-4 w-4" />
            IA pensando em tempo real
          </motion.div>

          <motion.div
            className="absolute -left-3 top-28 z-20 hidden rounded-xl border border-cyan-300/20 bg-white/[0.07] px-4 py-3 shadow-[0_18px_54px_rgba(56,189,248,0.16)] backdrop-blur-xl md:block"
            animate={{ x: [0, 8, 0], y: [0, -6, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/12 text-cyan-200">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-sm font-black text-foreground">Follow-up automatico</strong>
                <span className="text-xs font-bold text-muted-foreground">Lead recebeu resposta</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            onMouseMove={handleDashboardMove}
            onMouseLeave={resetDashboardTilt}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            className="hero-command-center premium-card relative mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#060914]/76 p-4 shadow-[0_44px_160px_rgba(37,99,235,0.24)] backdrop-blur-2xl sm:p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%,rgba(168,85,247,0.08))]" />
            <div className="relative z-10">
              <div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/24 px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="nova-logo-mark flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 shadow-[0_16px_44px_rgba(56,189,248,0.22)]">
                    <Bot className="relative z-10 h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-foreground sm:text-base">NovaCore Command Center</h2>
                    <p className="text-xs font-bold text-muted-foreground">Atendimento, CRM, agenda e vendas conectados</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                    Online
                  </span>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black text-cyan-100">
                    24/7 ativo
                  </span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1.24fr_0.92fr]">
                <section className="rounded-2xl border border-white/10 bg-black/22 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-cyan-300">Agente NovaCore</span>
                      <h3 className="mt-1 text-lg font-black text-foreground">Chat de IA funcionando</h3>
                    </div>
                    <Activity className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.text}
                        initial={{ opacity: 0, x: message.side === "customer" ? 18 : -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.55 + index * 0.24 }}
                        className={`max-w-[94%] rounded-2xl px-4 py-3 text-sm font-bold leading-6 ${
                          message.side === "customer"
                            ? "ml-auto rounded-tr-md bg-primary text-primary-foreground"
                            : "rounded-tl-md border border-white/10 bg-white/[0.075] text-foreground"
                        }`}
                      >
                        {message.text}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 1.35 }}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100"
                    >
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      IA preparando diagnostico
                    </motion.div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/22 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-cyan-300">Fluxo operacional</span>
                      <h3 className="mt-1 text-lg font-black text-foreground">Automacoes acontecendo</h3>
                    </div>
                    <Workflow className="h-5 w-5 text-cyan-300" />
                  </div>

                  <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 520 360" fill="none">
                    <path className="data-flow-line" d="M72 98 C160 30 322 28 438 98" stroke="url(#flowA)" strokeWidth="2" />
                    <path className="data-flow-line" d="M86 248 C180 328 326 318 448 244" stroke="url(#flowB)" strokeWidth="2" />
                    <path className="data-flow-line" d="M112 182 C208 112 314 118 420 182" stroke="url(#flowC)" strokeWidth="2" />
                    <defs>
                      <linearGradient id="flowA" x1="72" x2="438" y1="98" y2="98">
                        <stop stopColor="#67e8f9" />
                        <stop offset="1" stopColor="#818cf8" />
                      </linearGradient>
                      <linearGradient id="flowB" x1="86" x2="448" y1="248" y2="244">
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#c084fc" />
                      </linearGradient>
                      <linearGradient id="flowC" x1="112" x2="420" y1="182" y2="182">
                        <stop stopColor="#60a5fa" />
                        <stop offset="1" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {workflowNodes.map((node, index) => (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.42, delay: 0.72 + index * 0.1 }}
                        className="rounded-xl border border-white/10 bg-[#0a1020]/82 p-3 shadow-[0_14px_34px_rgba(2,6,23,0.24)]"
                      >
                        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.07] ${node.tone}`}>
                          <node.icon className="h-5 w-5" />
                        </div>
                        <strong className="block text-sm font-black text-foreground">{node.label}</strong>
                        <span className="mt-1 block text-xs font-extrabold text-muted-foreground">{node.status}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-2">
                    {automations.map((automation, index) => (
                      <motion.div
                        key={automation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.36, delay: 1.15 + index * 0.12 }}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-cyan-50/86"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        {automation}
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-black/22 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-cyan-300">Analytics vivos</span>
                      <h3 className="mt-1 text-lg font-black text-foreground">Pipeline em tempo real</h3>
                    </div>
                    <BarChart3 className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div className="space-y-3">
                    {pipeline.map((item, index) => (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs font-black text-muted-foreground">{item.label}</span>
                          <strong className="text-sm font-black text-foreground">{item.value}</strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.9, delay: 0.95 + index * 0.12, ease: "easeOut" }}
                            style={{ width: item.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/10 p-3">
                      <Clock className="mb-3 h-4 w-4 text-emerald-200" />
                      <strong className="block text-xl font-black text-foreground">2.4s</strong>
                      <span className="text-xs font-bold text-muted-foreground">resposta media</span>
                    </div>
                    <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-3">
                      <TrendingUp className="mb-3 h-4 w-4 text-cyan-200" />
                      <strong className="block text-xl font-black text-foreground">+37%</strong>
                      <span className="text-xs font-bold text-muted-foreground">conversao</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Send, label: "Notificacao enviada", value: "Proposta em follow-up" },
                  { icon: Cpu, label: "Agente operando", value: "17 tarefas em execucao" },
                  { icon: CheckCircle2, label: "CRM atualizado", value: "Novo negocio criado" },
                ].map((event, index) => (
                  <motion.div
                    key={event.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 1.25 + index * 0.14 }}
                    className="rounded-2xl border border-white/10 bg-black/22 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-cyan-200">
                      <event.icon className="h-4 w-4" />
                      {event.label}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">{event.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
