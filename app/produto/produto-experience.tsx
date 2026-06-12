"use client"

import type { MouseEvent, ReactNode } from "react"
import Link from "next/link"
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarClock,
  CircuitBoard,
  DatabaseZap,
  Gauge,
  Headphones,
  Layers3,
  LineChart,
  Link2,
  LockKeyhole,
  MessageSquareText,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Workflow,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SoliciteIaLink } from "@/components/solicite-ia-link"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
}

type FeatureItem = {
  icon: LucideIcon
  title: string
  description: string
  metric: string
}

const platformFeatures: FeatureItem[] = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description: "Atendem, qualificam, consultam dados e executam rotinas com contexto real do negocio.",
    metric: "24/7",
  },
  {
    icon: Workflow,
    title: "Automacoes",
    description: "Orquestram follow-up, triagem, agenda, cobrancas, handoff humano e tarefas internas.",
    metric: "Fluxos",
  },
  {
    icon: DatabaseZap,
    title: "CRM vivo",
    description: "Atualiza cadastros, organiza pipeline e registra interacoes sem retrabalho operacional.",
    metric: "Dados",
  },
  {
    icon: Link2,
    title: "Integracoes",
    description: "Conecta WhatsApp, formularios, agenda, pagamentos, BI e sistemas sob medida.",
    metric: "API",
  },
]

const serviceLayers = [
  {
    icon: MessageSquareText,
    title: "Atendimento",
    description: "Respostas instantaneas com memoria, criterios de negocio e encaminhamento inteligente.",
  },
  {
    icon: CalendarClock,
    title: "Vendas",
    description: "Qualificacao, priorizacao, lembretes e follow-ups para transformar conversa em receita.",
  },
  {
    icon: Headphones,
    title: "Suporte",
    description: "Classificacao de solicitacoes, consulta a bases internas e reducao de filas repetitivas.",
  },
  {
    icon: LineChart,
    title: "Operacao",
    description: "Dashboards, alertas e eventos que deixam cada processo rastreavel em tempo real.",
  },
]

const processSteps = [
  "Mapeamento dos processos, canais, gargalos e regras comerciais.",
  "Desenho dos agentes, automacoes, integracoes e logica operacional.",
  "Implantacao conectada ao CRM, agenda, atendimento e sistemas internos.",
  "Acompanhamento de metricas, melhoria continua e evolucao da plataforma.",
]

const commandEvents = [
  { label: "Lead recebido", status: "qualificando", value: "00:04" },
  { label: "Agenda consultada", status: "horario sugerido", value: "12 slots" },
  { label: "CRM atualizado", status: "pipeline limpo", value: "100%" },
  { label: "Follow-up criado", status: "proxima acao", value: "D+1" },
]

const outcomeMetrics = [
  { icon: TimerReset, value: "64h", label: "economizadas por mes em tarefas repetitivas" },
  { icon: Activity, value: "98%", label: "das conversas com triagem e registro automatico" },
  { icon: Gauge, value: "3x", label: "mais velocidade entre primeiro contato e acao comercial" },
]

const trustSignals = [
  { icon: ShieldCheck, label: "Governanca" },
  { icon: Layers3, label: "Escala" },
  { icon: Network, label: "Integracoes" },
  { icon: LockKeyhole, label: "Seguranca" },
]

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
      className={centered ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}
    >
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-3 text-[0.68rem] font-black uppercase tracking-[0.28em] text-white/48"
      >
        <span className="h-px w-9 bg-white/32" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="mt-5 text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>
      {children && (
        <motion.p variants={fadeUp} className="mt-6 text-base leading-8 text-white/58 sm:text-lg">
          {children}
        </motion.p>
      )}
    </motion.div>
  )
}

function ProductAmbient({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const cursorLight = useMotionTemplate`radial-gradient(34rem 28rem at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.16), transparent 64%), radial-gradient(16rem 14rem at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.12), transparent 76%)`

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="neo-ambient-base absolute inset-0" />
      <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: cursorLight }} />
      <div className="neo-depth-panel neo-depth-panel-a absolute" />
      <div className="neo-depth-panel neo-depth-panel-b absolute" />
      <div className="neo-depth-panel neo-depth-panel-c absolute" />
      <div className="neo-noise absolute inset-0" />
      <div className="neo-vignette absolute inset-0" />
    </div>
  )
}

function GeometricCore({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const shouldReduceMotion = useReducedMotion()
  const rotateX = useTransform(mouseY, [0, 100], [10, -10])
  const rotateY = useTransform(mouseX, [0, 100], [-14, 14])
  const x = useTransform(mouseX, [0, 100], [-18, 18])
  const y = useTransform(mouseY, [0, 100], [-12, 12])
  const reactiveGlow = useMotionTemplate`radial-gradient(22rem 18rem at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.24), transparent 68%)`

  return (
    <div className="neo-core-stage absolute inset-x-0 top-[8.5rem] mx-auto h-[32rem] max-w-7xl sm:top-[8rem] sm:h-[40rem]">
      <motion.div
        className="neo-core-object absolute left-1/2 top-1/2 h-[25rem] w-[min(88vw,58rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ rotateX, rotateY, x, y }}
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.018, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div className="neo-core-reactive-light absolute inset-0" style={{ background: reactiveGlow }} />
        <div className="neo-core-edge absolute inset-x-[7%] top-[6%] h-[80%]" />
        <div className="neo-core-fill absolute inset-x-[9.5%] top-[9%] h-[73%]" />
        <div className="neo-core-face neo-core-face-left absolute" />
        <div className="neo-core-face neo-core-face-right absolute" />
        <div className="neo-core-face neo-core-face-bottom absolute" />
        <div className="neo-core-inner neo-core-inner-a absolute" />
        <div className="neo-core-inner neo-core-inner-b absolute" />
        <div className="neo-core-inner neo-core-inner-c absolute" />
        <div className="neo-core-cube neo-core-cube-a absolute" />
        <div className="neo-core-cube neo-core-cube-b absolute" />
        <div className="neo-core-cube neo-core-cube-c absolute" />
      </motion.div>
    </div>
  )
}

function HeroSection({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  return (
    <section
      id="home"
      className="neo-hero relative z-10 flex min-h-[90svh] scroll-mt-24 flex-col items-center justify-center px-4 pb-12 pt-28 text-center sm:px-6 lg:px-8"
    >
      <GeometricCore mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center"
      >
        <motion.span variants={fadeUp} className="neo-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white">
          <Sparkles className="h-4 w-4" />
          NovaCoreAI Operating Layer
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-9 max-w-6xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl xl:text-[6.9rem]"
        >
          O sistema operacional para empresas modernas.
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/68 sm:text-xl">
          Agentes de IA, automacoes e integracoes que executam processos, atendem clientes e impulsionam vendas sem
          intervencao humana.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <SoliciteIaLink className="neo-button neo-button-primary inline-flex min-h-14 w-full items-center justify-center gap-2 px-7 py-4 text-base font-black text-white sm:w-auto">
            Agendar Diagnostico
            <ArrowRight className="h-5 w-5" />
          </SoliciteIaLink>
          <Link
            href="#plataforma"
            className="neo-button neo-button-ghost inline-flex min-h-14 w-full items-center justify-center gap-2 px-7 py-4 text-base font-black text-white sm:w-auto"
          >
            <Play className="h-5 w-5" />
            Explorar Plataforma
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 grid w-full max-w-5xl grid-cols-2 gap-px overflow-hidden border-y border-white/10 bg-white/10 md:grid-cols-4"
        >
          {trustSignals.map((item) => (
            <div key={item.label} className="flex min-h-20 items-center justify-center gap-3 bg-[#050505]/86 px-4">
              <item.icon className="h-4 w-4 text-white/62" />
              <span className="text-sm font-black uppercase tracking-[0.14em] text-white/48">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function PlatformSection() {
  return (
    <section id="plataforma" className="relative z-10 scroll-mt-24 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <SectionIntro eyebrow="Plataforma" title="Uma camada de execucao entre clientes, dados e times.">
          A NovaCoreAI nao entrega apenas chatbots. Ela cria uma operacao conectada, com agentes que entendem contexto,
          consultam sistemas e acionam fluxos de ponta a ponta.
        </SectionIntro>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="neo-command-panel relative overflow-hidden border border-white/12 bg-white/[0.035] p-3"
        >
          <div className="relative z-10 border border-white/10 bg-black/76">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/36" />
                <span className="h-2 w-2 rounded-full bg-white/22" />
                <span className="h-2 w-2 rounded-full bg-white/14" />
              </div>
              <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/42">Command OS</span>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[0.85fr_1.15fr]">
              <div className="border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-white/42">Operacao</span>
                    <h3 className="mt-2 text-2xl font-black text-white">Ao vivo</h3>
                  </div>
                  <Activity className="h-5 w-5 text-white/54" />
                </div>
                <div className="grid gap-3">
                  {commandEvents.map((event, index) => (
                    <motion.div
                      key={event.label}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <strong className="block text-sm font-black text-white">{event.label}</strong>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/38">
                          {event.status}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white/72">{event.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {platformFeatures.map((feature, index) => (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 + index * 0.06 }}
                    className="neo-feature-card min-h-[190px] border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center border border-white/12 bg-black/38 text-white">
                        <feature.icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/36">{feature.metric}</span>
                    </div>
                    <h3 className="text-lg font-black text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/52">{feature.description}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicos" className="relative z-10 scroll-mt-24 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Servicos" title="Do atendimento ao backoffice, a IA trabalha onde existe repeticao." centered>
          Cada agente e desenhado para executar um processo real: responder, classificar, consultar, registrar, acionar e
          medir.
        </SectionIntro>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {serviceLayers.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.52, delay: index * 0.07 }}
              className="neo-feature-card min-h-[260px] border border-white/10 bg-white/[0.035] p-5"
            >
              <span className="mb-10 flex h-12 w-12 items-center justify-center border border-white/12 bg-black/42 text-white">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-black text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/52">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="sobre" className="relative z-10 scroll-mt-24 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <SectionIntro eyebrow="Implantacao" title="Arquitetura sob medida, sem perder velocidade.">
          O projeto nasce do processo da empresa e vira uma operacao monitoravel: agentes, integracoes, regras, metricas
          e evolucao continua em uma so camada.
        </SectionIntro>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10">
          {processSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="grid gap-6 bg-[#050505] p-6 sm:grid-cols-[90px_1fr]"
            >
              <span className="text-4xl font-black leading-none text-white/18">0{index + 1}</span>
              <p className="text-xl font-black leading-8 text-white">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section id="beneficios" className="relative z-10 scroll-mt-24 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionIntro eyebrow="Resultados" title="Menos operacao manual. Mais resposta, rastreio e venda.">
            A plataforma reduz o intervalo entre intencao do cliente e acao da empresa, mantendo contexto, historico e
            priorizacao em cada etapa.
          </SectionIntro>

          <div className="grid gap-4">
            {outcomeMetrics.map((metric, index) => (
              <motion.article
                key={metric.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.48, delay: index * 0.07 }}
                className="neo-metric-row grid grid-cols-[72px_1fr] gap-5 border border-white/10 bg-white/[0.035] p-5"
              >
                <span className="flex h-16 w-16 items-center justify-center border border-white/12 bg-black/44 text-white">
                  <metric.icon className="h-6 w-6" />
                </span>
                <div>
                  <strong className="block text-4xl font-black leading-none text-white">{metric.value}</strong>
                  <span className="mt-2 block text-sm leading-7 text-white/52">{metric.label}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section id="arquitetura" className="relative z-10 scroll-mt-24 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="neo-architecture relative min-h-[520px] overflow-hidden border border-white/10 bg-white/[0.025]">
          <div className="neo-architecture-grid absolute inset-0" />
          <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/18 bg-black/80 text-white shadow-[0_0_80px_rgba(255,255,255,0.12)]">
            <BrainCircuit className="h-12 w-12" />
          </div>
          {["Cliente", "CRM", "Agenda", "Vendas", "Suporte", "BI"].map((item, index) => (
            <div key={item} className={`neo-orbit-node neo-orbit-node-${index + 1} absolute`}>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <SectionIntro eyebrow="Arquitetura" title="A IA deixa de ser interface e vira infraestrutura.">
          A NovaCoreAI fica entre canais, dados e pessoas. Ela interpreta intencao, aciona regras, chama sistemas e
          registra cada etapa para que a operacao nao dependa de tarefas invisiveis.
        </SectionIntro>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative z-10 px-4 py-28 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="neo-final-cta mx-auto max-w-7xl overflow-hidden border border-white/12 bg-white/[0.035] px-6 py-16 text-center sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white/44">
            <Zap className="h-4 w-4" />
            Diagnostico NovaCoreAI
          </span>
          <h2 className="mt-6 text-4xl font-black leading-[1.02] text-white sm:text-6xl">
            Coloque sua operacao para executar sem depender de tarefas manuais.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
            Em uma conversa, mapeamos os gargalos e desenhamos onde agentes, automacoes e integracoes podem gerar impacto
            primeiro.
          </p>
          <div className="mt-10 flex justify-center">
            <SoliciteIaLink className="neo-button neo-button-primary inline-flex min-h-14 items-center justify-center gap-2 px-8 py-4 text-base font-black text-white">
              Agendar Diagnostico
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
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-white/16 bg-white/[0.035] text-white">
            <CircuitBoard className="h-5 w-5" />
          </span>
          <span className="text-xl font-black text-white">NovaCoreAI</span>
        </Link>

        <nav className="flex flex-wrap gap-5 text-sm font-bold text-white/44">
          <Link href="#plataforma" className="transition hover:text-white">
            Plataforma
          </Link>
          <Link href="#servicos" className="transition hover:text-white">
            Servicos
          </Link>
          <Link href="#beneficios" className="transition hover:text-white">
            Beneficios
          </Link>
          <Link href="/politica-de-privacidade" className="transition hover:text-white">
            Privacidade
          </Link>
          <Link href="/termos-de-uso" className="transition hover:text-white">
            Termos
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-bold text-white/32">
        &copy; {new Date().getFullYear()} NovaCore AI. Todos os direitos reservados.
      </div>
    </footer>
  )
}

export function ProdutoExperience() {
  const mouseX = useMotionValue(52)
  const mouseY = useMotionValue(28)
  const smoothX = useSpring(mouseX, { stiffness: 84, damping: 26, mass: 0.36 })
  const smoothY = useSpring(mouseY, { stiffness: 84, damping: 26, mass: 0.36 })

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    mouseX.set((event.clientX / window.innerWidth) * 100)
    mouseY.set((event.clientY / window.innerHeight) * 100)
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      className="neo-page-shell relative isolate min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <ProductAmbient mouseX={smoothX} mouseY={smoothY} />
      <HeroSection mouseX={smoothX} mouseY={smoothY} />
      <PlatformSection />
      <ServicesSection />
      <ProcessSection />
      <BenefitsSection />
      <ArchitectureSection />
      <FinalCta />
      <ProductFooter />
    </main>
  )
}
