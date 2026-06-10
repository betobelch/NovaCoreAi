"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Bot, Calendar, Database, MessageSquare, Plug, ShoppingCart, Workflow, Zap } from "lucide-react"

const services = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description: "Assistentes que entendem contexto, seguem regras comerciais e operam como parte real da equipe.",
    features: ["Linguagem natural", "Contexto do negocio", "Operacao 24/7"],
  },
  {
    icon: MessageSquare,
    title: "IA para WhatsApp",
    description: "Atendimento automatico para responder, qualificar, agendar e encaminhar clientes no momento certo.",
    features: ["Respostas instantaneas", "Qualificacao de leads", "Handoff humano"],
  },
  {
    icon: Database,
    title: "CRM inteligente",
    description: "Leads, historico, etapas e tarefas sincronizados sem depender de preenchimento manual.",
    features: ["Dados estruturados", "Pipeline atualizado", "Visao comercial"],
  },
  {
    icon: Workflow,
    title: "Fluxos automatizados",
    description: "Rotinas que conectam atendimento, agenda, vendas e backoffice em tempo real.",
    features: ["Menos retrabalho", "Menos erro", "Mais velocidade"],
  },
  {
    icon: Calendar,
    title: "Agendamentos inteligentes",
    description: "Confirmacoes, lembretes, reagendamentos e disponibilidade integrados ao atendimento.",
    features: ["Agenda sincronizada", "Lembretes automaticos", "Menos faltas"],
  },
  {
    icon: ShoppingCart,
    title: "Automacao de vendas",
    description: "Acompanhamento de oportunidades, proposta, follow-up e alertas para leads quentes.",
    features: ["Follow-up automatico", "Priorizacao de leads", "Conversao assistida"],
  },
  {
    icon: Plug,
    title: "Integracoes sob medida",
    description: "APIs, sistemas internos, formularios, pagamentos e ferramentas conectados em uma arquitetura limpa.",
    features: ["APIs personalizadas", "Sincronizacao segura", "Dados rastreaveis"],
  },
  {
    icon: BarChart3,
    title: "Analytics vivos",
    description: "Indicadores para acompanhar atendimento, velocidade, conversao e impacto operacional.",
    features: ["Metricas em tempo real", "Dashboards executivos", "Decisoes melhores"],
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/18 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-black uppercase text-cyan-300">Produtos e servicos</span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            Uma camada de IA para transformar atendimento, CRM e vendas em fluxo continuo.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Criamos solucoes personalizadas que economizam tempo, aumentam produtividade e deixam sua operacao pronta
            para escalar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="premium-card group h-full rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_70px_rgba(2,6,23,0.2)] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-cyan-300/40"
            >
              <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/16 to-violet-400/16 text-cyan-200 transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-xl font-black text-foreground">{service.title}</h3>
                <p className="mb-5 leading-7 text-muted-foreground">{service.description}</p>

                <ul className="space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.72)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/produto"
              className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-black text-primary-foreground transition hover:bg-primary/90"
            >
              Conhecer mais
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
