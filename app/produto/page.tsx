import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock3,
  MessageSquare,
  PlayCircle,
  Plug,
  ShoppingCart,
  Sparkles,
  Workflow,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { SoliciteIaLink } from "@/components/solicite-ia-link"

export const metadata: Metadata = {
  title: "Produto | NovaCore AI",
  description:
    "Conheca a demonstracao da NovaCore AI para atendimento, automacao, integracoes, agendamento e vendas com inteligencia artificial.",
}

const serviceBenefits = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description:
      "Atendem clientes, entendem contexto e conduzem conversas com respostas alinhadas ao seu negocio.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp inteligente",
    description:
      "Recebe leads, qualifica pedidos e encaminha as melhores oportunidades para a equipe certa.",
  },
  {
    icon: Workflow,
    title: "Automacao de processos",
    description:
      "Reduz tarefas repetitivas, organiza etapas internas e evita que demandas importantes fiquem paradas.",
  },
  {
    icon: Plug,
    title: "Integracao de sistemas",
    description:
      "Conecta CRM, planilhas, formulários, agenda e ferramentas internas em um fluxo unico de trabalho.",
  },
  {
    icon: Calendar,
    title: "Agendamento inteligente",
    description:
      "Sugere horarios, confirma presencas, envia lembretes e reduz faltas sem depender de trabalho manual.",
  },
  {
    icon: ShoppingCart,
    title: "Automacao de vendas",
    description:
      "Acompanha o funil, dispara follow-ups, identifica oportunidades e ajuda a equipe a fechar mais rapido.",
  },
]

const processSteps = [
  {
    title: "Mapeamos o atendimento",
    description:
      "Entendemos seus canais, perguntas frequentes, equipe, funil comercial e gargalos operacionais.",
  },
  {
    title: "Criamos o fluxo com IA",
    description:
      "Desenhamos o comportamento do agente, as regras de atendimento e os caminhos de automacao.",
  },
  {
    title: "Conectamos suas ferramentas",
    description:
      "Integramos WhatsApp, agenda, CRM, formularios, planilhas e sistemas que ja fazem parte da rotina.",
  },
  {
    title: "Acompanhamos resultados",
    description:
      "Ajustamos respostas, analisamos conversas e melhoramos o desempenho conforme o uso real.",
  },
]

const productHighlights = [
  "Atendimento 24 horas sem perder contexto",
  "Menos tarefas manuais para sua equipe",
  "Leads organizados e qualificados automaticamente",
  "Integracoes feitas sob medida para o seu processo",
]

export default function ProdutoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[calc(100svh-7rem)] overflow-hidden bg-[#07111f] pt-24 text-white">
        <img
          src="/produto-hero.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.82)_38%,rgba(2,6,23,0.36)_68%,rgba(2,6,23,0.08)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-13rem)] max-w-7xl flex-col justify-center px-4 pb-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase text-blue-100 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Produto NovaCore AI
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
            IA operacional para atendimento, vendas e processos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            A NovaCore AI cria agentes, automacoes e integracoes sob medida para transformar conversas em atendimento,
            agenda, acompanhamento e oportunidades reais de venda.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contato"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 font-bold text-white shadow-lg shadow-blue-950/30 transition-colors hover:bg-blue-400"
            >
              Falar com a equipe
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#video"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 font-bold text-white backdrop-blur transition-colors hover:bg-white/16"
            >
              <PlayCircle className="h-5 w-5" />
              Ver demonstracao
            </Link>
          </div>
          <div className="mt-10 grid max-w-3xl gap-4 border-t border-white/14 pt-6 sm:grid-cols-3">
            <div>
              <strong className="block text-2xl font-black text-white">24h</strong>
              <span className="text-sm font-semibold text-slate-300">atendimento automatizado</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-white">+ CRM</strong>
              <span className="text-sm font-semibold text-slate-300">dados e leads organizados</span>
            </div>
            <div>
              <strong className="block text-2xl font-black text-white">Sob medida</strong>
              <span className="text-sm font-semibold text-slate-300">fluxos para seu processo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-secondary/35 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {productHighlights.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <p className="text-sm font-bold leading-6 text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="video" className="scroll-mt-24 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase text-primary">Video do produto</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl">
              Veja o fluxo completo em uma unica experiencia.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              A demonstracao mostra como um cliente chega pelo atendimento, como a IA entende o pedido, atualiza
              sistemas internos e entrega informacao util para acompanhamento.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--panel-shadow)]">
            <video
              className="aspect-video w-full bg-muted object-cover"
              controls
              preload="metadata"
              poster="/produto-demo-poster.svg"
              aria-label="Assistir demonstracao da NovaCore AI"
            >
              <source src="/produto-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="bg-secondary/35 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase text-primary">Como funciona</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl">
              Da conversa inicial ao fluxo funcionando.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-lg font-black text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-black text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-sm font-bold uppercase text-primary">Onde ajuda</span>
              <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl">
                Baseado nos servicos que voce ja viu.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                O produto combina as principais frentes da NovaCore AI em uma solucao pratica para empresas que querem
                ganhar velocidade sem perder controle.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {serviceBenefits.map((benefit) => (
                <article key={benefit.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/55 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
              <Clock3 className="h-4 w-4" />
              Proximo passo
            </span>
            <h2 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
              Vamos transformar um processo real da sua empresa em automacao.
            </h2>
          </div>
          <SoliciteIaLink
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Solicite sua IA
            <ArrowRight className="h-5 w-5" />
          </SoliciteIaLink>
        </div>
      </section>

      <Footer />
    </main>
  )
}
