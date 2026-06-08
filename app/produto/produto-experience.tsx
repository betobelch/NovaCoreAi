"use client"

import type { MouseEvent, ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Gauge,
  Headphones,
  Layers3,
  LineChart,
  MessageSquareText,
  Network,
  Play,
  Radio,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  UsersRound,
  Workflow,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ContactLink } from "@/components/contact-link"
import { SoliciteIaLink } from "@/components/solicite-ia-link"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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

type IconItem = {
  icon: LucideIcon
  label: string
  value?: string
  description?: string
}

const microMetrics: IconItem[] = [
  { icon: Clock3, label: "Atendimento 24h", value: "Sempre ativo" },
  { icon: DatabaseZap, label: "CRM integrado", value: "Dados sincronizados" },
  { icon: Workflow, label: "Fluxos sob medida", value: "Operacao conectada" },
  { icon: UsersRound, label: "Leads organizados", value: "Pipeline limpo" },
]

const processSteps = [
  {
    title: "Mapeamos seu atendimento",
    description: "Entendemos canais, equipe, perguntas, gargalos, regras comerciais e pontos de decisao do fluxo real.",
  },
  {
    title: "Criamos o fluxo com IA",
    description: "Desenhamos agentes, automacoes, respostas, classificacoes e a logica operacional por tras da conversa.",
  },
  {
    title: "Integramos sistemas e CRM",
    description: "Conectamos agenda, CRM, planilhas, formularios, WhatsApp e ferramentas internas com rastreabilidade.",
  },
  {
    title: "Acompanhamos resultados",
    description: "Monitoramos uso, ajustamos prompts, melhoramos rotas e deixamos a automacao mais precisa a cada ciclo.",
  },
]

const benefits = [
  {
    icon: MessageSquareText,
    title: "Automacao de atendimento",
    description: "Respostas instantaneas com contexto, triagem inteligente e encaminhamento para o time certo.",
    stat: "24/7",
  },
  {
    icon: TrendingUp,
    title: "Automacao de vendas",
    description: "Qualificacao, follow-up e alertas de oportunidade para transformar conversa em receita.",
    stat: "+Leads",
  },
  {
    icon: CalendarClock,
    title: "Agendamento inteligente",
    description: "Sugestao de horarios, confirmacoes, lembretes e reducao de faltas sem trabalho manual.",
    stat: "Agenda",
  },
  {
    icon: Network,
    title: "Integracoes sob medida",
    description: "APIs, CRM, planilhas e sistemas internos conectados em um fluxo operacional unico.",
    stat: "API",
  },
  {
    icon: Headphones,
    title: "IA para suporte",
    description: "Classifica tickets, consulta bases internas e entrega respostas consistentes para clientes.",
    stat: "SLA",
  },
  {
    icon: DatabaseZap,
    title: "CRM automatizado",
    description: "Atualiza cadastros, registra interacoes, organiza pipeline e prepara proximas acoes.",
    stat: "CRM",
  },
]

const particles = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 9) % 100}%`,
  top: `${(index * 53 + 17) % 100}%`,
  size: 2 + (index % 4),
  depth: 8 + (index % 7) * 4,
  delay: (index % 9) * 0.24,
  duration: 4.8 + (index % 6) * 0.7,
  opacity: 0.28 + (index % 5) * 0.08,
}))

const dashboardStats = [
  { label: "Conversas resolvidas", value: "89%", width: "89%", icon: CheckCircle2 },
  { label: "Leads qualificados", value: "312", width: "72%", icon: UsersRound },
  { label: "Tempo economizado", value: "64h", width: "81%", icon: TimerReset },
]

const pipeline = [
  { label: "Novo lead", count: "128", color: "bg-sky-400" },
  { label: "Qualificado", count: "74", color: "bg-violet-400" },
  { label: "Agendado", count: "38", color: "bg-cyan-300" },
  { label: "Oportunidade", count: "19", color: "bg-emerald-300" },
]

const footerLinks = [
  { label: "Atendimento", href: "#beneficios" },
  { label: "Vendas", href: "#beneficios" },
  { label: "CRM", href: "#beneficios" },
  { label: "Demonstração", href: "#demonstracao" },
]

function ReactiveParticle({
  particle,
  mouseX,
  mouseY,
}: {
  particle: (typeof particles)[number]
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const x = useTransform(mouseX, [0, 100], [-particle.depth, particle.depth])
  const y = useTransform(mouseY, [0, 100], [-particle.depth * 0.7, particle.depth * 0.7])

  return (
    <motion.span
      className="absolute hidden rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(56,189,248,0.82)] sm:block"
      style={{
        left: particle.left,
        top: particle.top,
        width: particle.size,
        height: particle.size,
        opacity: particle.opacity,
        x,
        y,
      }}
      animate={{ scale: [0.75, 1.28, 0.75], opacity: [particle.opacity, 0.9, particle.opacity] }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

function ProductAmbient({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const cursorGlow = useMotionTemplate`radial-gradient(36rem 28rem at ${mouseX}% ${mouseY}%, rgba(56, 189, 248, 0.2), transparent 62%), radial-gradient(26rem 22rem at calc(${mouseX}% + 8%) calc(${mouseY}% + 12%), rgba(168, 85, 247, 0.16), transparent 68%)`

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="product-cinematic-base absolute inset-0" />
      <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: cursorGlow }} />
      <div className="product-aurora-field product-aurora-field-a absolute -left-1/4 top-0 h-[42rem] w-[150vw]" />
      <div className="product-aurora-field product-aurora-field-b absolute -right-1/3 top-1/3 h-[38rem] w-[145vw]" />
      <div className="product-futuristic-grid absolute inset-0" />
      <div className="product-holographic-lines absolute inset-0" />
      <div className="product-scan-beam absolute inset-x-0 top-0 h-44" />
      <div className="product-noise-layer absolute inset-0" />
      {particles.map((particle) => (
        <ReactiveParticle key={particle.id} particle={particle} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  centered?: boolean
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200"
      >
        <span className="h-px w-8 bg-gradient-to-r from-cyan-300 to-violet-300" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {children && (
        <motion.p variants={fadeUp} className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
          {children}
        </motion.p>
      )}
    </motion.div>
  )
}

function ProductCommandMockup() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const dashboardY = useTransform(scrollYProgress, [0, 0.35], shouldReduceMotion ? [0, 0] : [0, -42])

  return (
    <motion.div
      style={{ y: dashboardY }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-3xl lg:max-w-none"
    >
      <motion.div
        className="product-floating-chip absolute -left-3 top-12 z-20 hidden w-[210px] border border-cyan-300/18 bg-white/[0.07] p-3 shadow-[0_22px_70px_rgba(14,165,233,0.18)] backdrop-blur-2xl md:block"
        animate={shouldReduceMotion ? undefined : { y: [0, -9, 0], x: [0, 5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-emerald-400/12 text-emerald-300">
            <Radio className="h-4 w-4" />
          </span>
          <div>
            <strong className="block text-sm font-black text-white">Lead quente</strong>
            <span className="text-xs font-bold text-slate-400">Prioridade atualizada</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="product-floating-chip absolute -right-2 bottom-16 z-20 hidden w-[224px] border border-violet-300/18 bg-white/[0.07] p-3 shadow-[0_22px_70px_rgba(168,85,247,0.18)] backdrop-blur-2xl sm:block"
        animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-violet-400/12 text-violet-200">
            <CalendarClock className="h-4 w-4" />
          </span>
          <div>
            <strong className="block text-sm font-black text-white">Agenda sincronizada</strong>
            <span className="text-xs font-bold text-slate-400">Reunião confirmada</span>
          </div>
        </div>
      </motion.div>

      <div className="product-dashboard product-breathing relative overflow-hidden border border-white/12 bg-white/[0.055] p-3 shadow-[0_44px_160px_rgba(37,99,235,0.28)] backdrop-blur-2xl">
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
        <div className="relative z-10 overflow-hidden border border-white/10 bg-[#070914]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-emerald-200 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.95)]" />
              Operação ativa
            </div>
          </div>

          <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[170px_minmax(0,1fr)]">
            <aside className="hidden border-r border-white/10 bg-white/[0.025] p-4 lg:block">
              <div className="mb-5 flex items-center gap-2">
                <span className="nova-logo-mark flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500">
                  <Bot className="relative z-10 h-4 w-4 text-white" />
                </span>
                <div>
                  <strong className="block text-sm font-black text-white">NovaCore</strong>
                  <span className="text-[0.68rem] font-bold text-slate-500">Command OS</span>
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { icon: MessageSquareText, label: "Atendimento" },
                  { icon: DatabaseZap, label: "CRM" },
                  { icon: Route, label: "Fluxos" },
                  { icon: BarChart3, label: "Analytics" },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-black ${
                      index === 0
                        ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                        : "text-slate-500"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </div>
            </aside>

            <div className="grid gap-4 p-4 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                        CRM inteligente
                      </span>
                      <h3 className="mt-1 text-xl font-black text-white">Pipeline operacional</h3>
                    </div>
                    <Gauge className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pipeline.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.45 + index * 0.1 }}
                        className="group rounded-[8px] border border-white/10 bg-black/22 p-3 transition hover:border-cyan-300/30 hover:bg-white/[0.055]"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">{item.label}</span>
                          <span className={`h-2 w-2 rounded-full ${item.color} shadow-[0_0_16px_currentColor]`} />
                        </div>
                        <strong className="text-2xl font-black text-white">{item.count}</strong>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className={`h-full rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${56 + index * 11}%` }}
                            transition={{ duration: 1.2, delay: 0.7 + index * 0.08, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">
                        Agente ativo
                      </span>
                      <h3 className="mt-1 text-xl font-black text-white">Atendimento vivo</h3>
                    </div>
                    <BrainCircuit className="h-5 w-5 text-violet-200" />
                  </div>
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.72 }}
                      className="ml-auto max-w-[88%] rounded-[8px] bg-cyan-300 px-3 py-2 text-sm font-black text-[#04111f]"
                    >
                      Preciso agendar uma visita e saber valores.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.95 }}
                      className="max-w-[92%] rounded-[8px] border border-white/10 bg-white/[0.07] px-3 py-2 text-sm font-bold leading-6 text-slate-200"
                    >
                      Entendi. Vou consultar agenda, classificar interesse e registrar o lead no CRM.
                    </motion.div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/18 bg-violet-300/10 px-3 py-2 text-xs font-black text-violet-100">
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-violet-200" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-violet-200" />
                      <span className="ai-thinking-dot h-1.5 w-1.5 rounded-full bg-violet-200" />
                      Processando intenção
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                <section className="relative overflow-hidden border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                        Automacoes
                      </span>
                      <h3 className="mt-1 text-lg font-black text-white">Fluxo em execução</h3>
                    </div>
                    <Workflow className="h-5 w-5 text-emerald-200" />
                  </div>
                  <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 420 260" fill="none">
                    <path
                      className="data-flow-line"
                      d="M48 70 C122 20 214 24 332 76"
                      stroke="url(#product-flow-a)"
                      strokeWidth="2"
                    />
                    <path
                      className="data-flow-line"
                      d="M66 180 C144 234 252 226 354 164"
                      stroke="url(#product-flow-b)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="product-flow-a" x1="48" x2="332" y1="70" y2="76">
                        <stop stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#a78bfa" />
                      </linearGradient>
                      <linearGradient id="product-flow-b" x1="66" x2="354" y1="180" y2="164">
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="relative z-10 grid grid-cols-2 gap-3">
                    {[
                      { icon: MessageSquareText, label: "Entrada" },
                      { icon: BrainCircuit, label: "IA entende" },
                      { icon: DatabaseZap, label: "CRM" },
                      { icon: CheckCircle2, label: "Follow-up" },
                    ].map((node, index) => (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.08 }}
                        className="rounded-[8px] border border-white/10 bg-[#080b18]/86 p-3"
                      >
                        <node.icon className="mb-3 h-5 w-5 text-cyan-200" />
                        <strong className="block text-sm font-black text-white">{node.label}</strong>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                        Analytics
                      </span>
                      <h3 className="mt-1 text-lg font-black text-white">Resultados em tempo real</h3>
                    </div>
                    <LineChart className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {dashboardStats.map((stat, index) => (
                      <div key={stat.label} className="rounded-[8px] border border-white/10 bg-black/22 p-3">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <stat.icon className="h-4 w-4 text-cyan-200" />
                          <span className="text-lg font-black text-white">{stat.value}</span>
                        </div>
                        <p className="min-h-10 text-xs font-bold leading-5 text-slate-400">{stat.label}</p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                            initial={{ width: 0 }}
                            animate={{ width: stat.width }}
                            transition={{ duration: 1.2, delay: 0.9 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MicroMetrics() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {microMetrics.map((metric) => (
        <motion.div
          key={metric.label}
          variants={fadeUp}
          whileHover={{ y: -5 }}
          className="product-glass-card group border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_70px_rgba(15,23,42,0.26)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_32px_rgba(56,189,248,0.12)]">
              <metric.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <strong className="block text-sm font-black text-white">{metric.label}</strong>
              <span className="mt-1 block truncate text-xs font-bold text-slate-400">{metric.value}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function DemoSection() {
  const [isDemoActive, setIsDemoActive] = useState(false)

  return (
    <section id="demonstracao" className="relative z-10 scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro eyebrow="Demonstração" title="Veja o fluxo completo em uma única experiência.">
          A demonstração mostra como um cliente chega pelo atendimento, como a IA entende o pedido, atualiza sistemas
          internos e entrega informação útil para acompanhamento.
        </SectionIntro>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="product-video-frame product-glass-card group relative overflow-hidden border border-cyan-200/14 bg-white/[0.06] p-3 shadow-[0_34px_130px_rgba(14,165,233,0.22)] backdrop-blur-2xl"
        >
          <div className="relative aspect-video overflow-hidden border border-white/10 bg-[#070914]">
            <img
              src="/produto-demo-poster.svg"
              alt="Demonstração visual da plataforma NovaCore AI"
              className="h-full w-full object-cover opacity-78 saturate-[1.2]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(56,189,248,0.06),rgba(5,5,5,0.24)_55%,rgba(5,5,5,0.68)_100%)]" />
            <button
              type="button"
              onClick={() => setIsDemoActive(true)}
              className="product-play-button absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/28 bg-white/10 text-white shadow-[0_0_70px_rgba(56,189,248,0.38)] backdrop-blur-xl transition group-hover:scale-105"
              aria-label={isDemoActive ? "Demonstração iniciada" : "Reproduzir demonstração"}
              title={isDemoActive ? "Demonstração iniciada" : "Reproduzir demonstração"}
            >
              <Play className="ml-1 h-8 w-8 fill-white" />
            </button>
            {isDemoActive && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-5 top-5 max-w-[calc(100%-2.5rem)] rounded-[8px] border border-emerald-300/20 bg-black/52 px-4 py-3 text-left backdrop-blur-xl"
              >
                <span className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
                  Demo iniciada
                </span>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-200">
                  Cliente recebido, IA qualificando pedido, CRM atualizado e follow-up preparado.
                </p>
              </motion.div>
            )}
            <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/44 px-4 py-3 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                  initial={{ width: "8%" }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-black text-slate-300">03:42</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TimelineSection() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/18 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Como funciona" title="Da conversa ao processo rodando com IA." centered>
          Uma operação premium nasce de mapeamento, desenho de fluxo, integração e melhoria contínua.
        </SectionIntro>

        <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="product-glass-card group relative min-h-[254px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_90px_rgba(15,23,42,0.28)] backdrop-blur-2xl"
            >
              <div className="relative z-10">
                <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-[8px] border border-cyan-300/24 bg-cyan-300/10 text-lg font-black text-cyan-100 shadow-[0_0_36px_rgba(56,189,248,0.2)]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-400">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section id="beneficios" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionIntro eyebrow="Benefícios" title="Automação inteligente para cada área crítica.">
            Atendimento, vendas, CRM, suporte, agenda e processos passam a operar em uma camada integrada, mensurável e
            pronta para escala.
          </SectionIntro>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{ y: -8, rotateX: 1.2, rotateY: index % 2 === 0 ? -1.2 : 1.2 }}
                className="product-tilt product-glass-card group min-h-[236px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl"
              >
                <div className="relative z-10">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-cyan-300/18 bg-gradient-to-br from-cyan-300/16 to-violet-400/16 text-cyan-100">
                      <benefit.icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-emerald-300/16 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                      {benefit.stat}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-400">{benefit.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7 }}
        className="product-final-cta relative mx-auto max-w-7xl overflow-hidden border border-white/12 bg-white/[0.055] px-6 py-16 text-center shadow-[0_40px_160px_rgba(37,99,235,0.28)] backdrop-blur-2xl sm:px-10 lg:px-16"
      >
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
            <Rocket className="h-4 w-4" />
            Próximo salto operacional
          </span>
          <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Vamos transformar um processo real da sua empresa em automação.
          </h2>
          <div className="mt-9 flex justify-center">
            <SoliciteIaLink className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 px-8 py-4 text-base font-black text-white shadow-[0_22px_80px_rgba(59,130,246,0.42)] transition hover:scale-[1.03] sm:text-lg">
              Solicite sua IA
              <ArrowRight className="h-5 w-5" />
            </SoliciteIaLink>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ProductFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            <span className="nova-logo-mark flex h-10 w-10 items-center justify-center rounded-[8px] bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 shadow-[0_0_36px_rgba(56,189,248,0.24)]">
              <Sparkles className="relative z-10 h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-black text-white">
              NovaCore<span className="text-cyan-200">AI</span>
            </span>
          </Link>
          <p className="max-w-md text-sm font-medium leading-7 text-slate-400">
            Plataforma de IA operacional para empresas que querem atendimento, vendas, CRM e processos funcionando com
            velocidade enterprise.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-300">Produto</h3>
          <ul className="grid gap-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm font-bold text-slate-500 transition hover:text-cyan-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-300">Redes</h3>
          <div className="flex gap-3">
            {[
              { label: "LinkedIn", icon: Network, href: "https://www.linkedin.com/company/novacore-ai" },
              { label: "Instagram", icon: MessageSquareText, href: "https://www.instagram.com/novacoreai" },
              { label: "NovaCore", icon: Sparkles, href: "/" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
                title={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.055] text-slate-400 backdrop-blur-xl transition hover:border-cyan-300/24 hover:text-cyan-100 hover:shadow-[0_0_32px_rgba(56,189,248,0.14)]"
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs font-bold text-slate-600 sm:flex-row">
        <p>© {new Date().getFullYear()} NovaCore AI. Todos os direitos reservados.</p>
        <div className="flex gap-5">
          <Link href="/politica-de-privacidade" className="transition hover:text-slate-300">
            Privacidade
          </Link>
          <Link href="/termos-de-uso" className="transition hover:text-slate-300">
            Termos
          </Link>
        </div>
      </div>
    </footer>
  )
}

export function ProdutoExperience() {
  const mouseX = useMotionValue(58)
  const mouseY = useMotionValue(26)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 24, mass: 0.35 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 24, mass: 0.35 })

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    mouseX.set((event.clientX / window.innerWidth) * 100)
    mouseY.set((event.clientY / window.innerHeight) * 100)
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      className="product-page-shell relative isolate min-h-screen overflow-hidden bg-[#050505] text-white [--background:#050505] [--border:rgba(255,255,255,0.12)] [--card:rgba(255,255,255,0.06)] [--foreground:#f8fbff] [--muted-foreground:#9ca3af] [--primary:#38bdf8] [--primary-foreground:#04111f]"
    >
      <ProductAmbient mouseX={smoothX} mouseY={smoothY} />

      <section className="relative z-10 flex min-h-[calc(100svh-32px)] items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-4xl text-center lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/18 bg-white/[0.06] px-4 py-2 text-sm font-black text-cyan-100 shadow-[0_18px_70px_rgba(14,165,233,0.14)] backdrop-blur-2xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              </span>
              Produto NovaCore AI
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-[Satoshi,var(--font-space),var(--font-inter),system-ui,sans-serif] text-4xl font-black leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              IA operacional para atendimento, vendas e processos.
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl lg:mx-0">
              A NovaCore AI cria agentes, automações e integrações sob medida para transformar conversas em atendimento,
              agenda, acompanhamento e oportunidades reais de venda.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <ContactLink
                className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 px-8 py-4 text-base font-black text-white shadow-[0_22px_80px_rgba(59,130,246,0.42)] transition hover:scale-[1.03] sm:text-lg"
              >
                Falar com a equipe
                <ArrowRight className="h-5 w-5" />
              </ContactLink>
              <Link
                href="#demonstracao"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/[0.055] px-8 py-4 text-base font-black text-white backdrop-blur-2xl transition hover:border-cyan-300/30 hover:bg-white/[0.09] hover:shadow-[0_0_42px_rgba(56,189,248,0.14)] sm:text-lg"
              >
                <Play className="h-5 w-5" />
                Ver demonstração
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              <MicroMetrics />
            </motion.div>
          </motion.div>

          <ProductCommandMockup />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 border-y border-white/10 py-6 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "SaaS enterprise", value: "Governança" },
            { icon: Layers3, label: "Plataforma viva", value: "Motion + dados" },
            { icon: Activity, label: "Operação real", value: "Fluxo completo" },
            { icon: Zap, label: "IA sob medida", value: "Alto valor" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.05] text-cyan-100">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <strong className="block text-sm font-black text-white">{item.label}</strong>
                <span className="text-xs font-bold text-slate-500">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DemoSection />
      <TimelineSection />
      <BenefitsSection />
      <FinalCta />
      <ProductFooter />
    </main>
  )
}
