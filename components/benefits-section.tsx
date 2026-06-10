"use client"

import { motion } from "framer-motion"
import { Bot, Calendar, Clock, Database, MessageCircle, Plug, Target, Workflow } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Atendimento 24h",
    description: "Clientes recebem resposta imediata em qualquer horario, sem sobrecarregar sua equipe.",
    stat: "24/7",
  },
  {
    icon: Database,
    title: "CRM automatizado",
    description: "Leads, historico e proximas acoes entram organizados no funil comercial.",
    stat: "100%",
  },
  {
    icon: MessageCircle,
    title: "IA para WhatsApp",
    description: "Conversas qualificadas, respostas consistentes e encaminhamento para o time certo.",
    stat: "2.4s",
  },
  {
    icon: Calendar,
    title: "Agendamentos inteligentes",
    description: "A IA confirma horarios, envia lembretes e reduz falhas no processo comercial.",
    stat: "-43%",
  },
  {
    icon: Bot,
    title: "Follow-up automatico",
    description: "Oportunidades recebem novas mensagens no tempo certo, sem dependencia manual.",
    stat: "+37%",
  },
  {
    icon: Plug,
    title: "Integracoes sob medida",
    description: "CRM, agenda, formularios, pagamentos e sistemas internos operando juntos.",
    stat: "API",
  },
  {
    icon: Target,
    title: "Gestao de leads",
    description: "Priorizacao de contatos quentes para sua equipe agir com mais velocidade.",
    stat: "+312",
  },
  {
    icon: Workflow,
    title: "Processos automatizados",
    description: "Menos tarefas repetitivas, menos retrabalho e mais foco no que gera receita.",
    stat: "18x",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(45,212,191,0.1),transparent_36%),radial-gradient(circle_at_84%_44%,rgba(59,130,246,0.12),transparent_42%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-black uppercase text-cyan-300">Beneficios</span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            O impacto aparece no atendimento, no time e nos numeros.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Uma IA operacional reduz carga manual, aumenta velocidade de resposta e cria uma rotina comercial mais
            previsivel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="premium-card product-tilt group rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_70px_rgba(2,6,23,0.22)] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-cyan-300/42"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/18 to-violet-400/18 text-cyan-200 shadow-[0_18px_44px_rgba(56,189,248,0.12)] transition-transform duration-300 group-hover:scale-110">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-black text-cyan-100">
                    {benefit.stat}
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-black text-foreground">{benefit.title}</h3>
                <p className="leading-7 text-muted-foreground">{benefit.description}</p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.12 + index * 0.04 }}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
