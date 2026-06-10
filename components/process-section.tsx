"use client"

import { motion } from "framer-motion"
import { BarChart3, Bot, BrainCircuit, Plug, Search, Workflow } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Mapeamos seu processo",
    description: "Entendemos canais, gargalos, regras comerciais, CRM, agenda e pontos onde tempo esta escapando.",
  },
  {
    icon: BrainCircuit,
    title: "Criamos a IA operacional",
    description: "Desenhamos um agente com linguagem, contexto, regras e comportamento alinhados a sua operacao.",
  },
  {
    icon: Plug,
    title: "Integramos sistemas e CRM",
    description: "Conectamos WhatsApp, formularios, CRM, agenda, pagamentos e ferramentas internas.",
  },
  {
    icon: Workflow,
    title: "Automatizamos atendimento e vendas",
    description: "Ativamos qualificacao, follow-up, notificacoes, handoff humano e rotinas repetitivas.",
  },
  {
    icon: BarChart3,
    title: "Monitoramos resultados",
    description: "Acompanhamos volume, conversao, velocidade de resposta e oportunidades geradas.",
  },
]

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(168,85,247,0.12),transparent_46%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-black uppercase text-cyan-300">Como funciona</span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            Da operacao atual ao agente rodando, sem teatro e sem complexidade desnecessaria.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            O processo foi pensado para entregar uma IA util, conectada e mensuravel desde os primeiros fluxos.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/35 to-violet-300/0 lg:left-1/2 lg:block" />

          <div className="grid gap-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.52, delay: index * 0.06 }}
                className={`relative grid gap-5 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div className={index % 2 === 1 ? "lg:pl-12" : "lg:pr-12"}>
                  <div className="premium-card group rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[0_22px_82px_rgba(2,6,23,0.22)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-300/35">
                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/18 to-violet-400/18 text-cyan-200 shadow-[0_18px_46px_rgba(56,189,248,0.12)] transition-transform group-hover:scale-105">
                        <step.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase text-cyan-300">Etapa 0{index + 1}</span>
                        <h3 className="mt-2 text-xl font-black text-foreground">{step.title}</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:pr-12" : "lg:pl-12"}>
                  <div className="hidden h-full items-center lg:flex">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_54px_rgba(56,189,248,0.22)]">
                      <Bot className="h-7 w-7" />
                      <span className="absolute -inset-2 rounded-3xl border border-cyan-300/10" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
