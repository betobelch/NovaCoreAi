"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Clock, Database, MessageCircle, Users, Workflow, Zap } from "lucide-react"

const beforeItems = [
  { icon: Users, title: "Equipe sobrecarregada", description: "Atendimento depende de pessoas pulando entre mensagens, agenda e planilhas." },
  { icon: MessageCircle, title: "Mensagens perdidas", description: "Leads ficam sem resposta quando chegam fora do horario ou em pico de demanda." },
  { icon: Clock, title: "Falta de follow-up", description: "Oportunidades esfriam porque ninguem volta no momento certo." },
  { icon: Database, title: "CRM desorganizado", description: "Dados chegam incompletos, duplicados ou simplesmente nao chegam." },
  { icon: Workflow, title: "Processos manuais", description: "Tarefas repetitivas travam o time e aumentam erro operacional." },
]

const afterItems = [
  { icon: Zap, title: "IA atende automaticamente", description: "Respostas imediatas, qualificacao inicial e direcionamento inteligente." },
  { icon: Database, title: "Leads organizados", description: "Cada contato entra no CRM com origem, contexto e proximo passo." },
  { icon: Clock, title: "Follow-up automatico", description: "Sequencias sao ativadas no tempo certo, sem depender de memoria." },
  { icon: Workflow, title: "Agenda sincronizada", description: "Disponibilidade, lembretes e handoff comercial no mesmo fluxo." },
  { icon: Users, title: "Equipe focada em vendas", description: "O operacional roda em segundo plano enquanto o time fecha negocios." },
]

const flowSteps = ["Lead entra", "IA qualifica", "CRM atualiza", "Follow-up dispara", "Venda avanca"]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function ProblemsSection() {
  return (
    <section id="transformacao" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.035] to-transparent" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/24 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <motion.span variants={fadeUp} className="text-sm font-black uppercase text-cyan-300">
            Antes e depois
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            A diferenca entre apagar incendio e operar com inteligencia.
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A NovaCore AI transforma uma rotina manual, lenta e dispersa em uma operacao conectada, rastreavel e ativa
            24 horas por dia.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.55 }}
            className="premium-card rounded-2xl border border-red-300/12 bg-red-950/10 p-5 shadow-[0_24px_86px_rgba(2,6,23,0.2)] backdrop-blur-2xl sm:p-6"
          >
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-red-200/80">Antes</span>
                <h3 className="text-xl font-black text-foreground">Operacao manual e vulneravel</h3>
              </div>
            </div>

            <div className="relative z-10 grid gap-3">
              {beforeItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-red-200" />
                    <strong className="text-sm font-black text-foreground">{item.title}</strong>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="premium-card rounded-2xl border border-cyan-300/18 bg-cyan-300/[0.045] p-5 shadow-[0_28px_100px_rgba(56,189,248,0.16)] backdrop-blur-2xl sm:p-6"
          >
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-emerald-200/86">Depois com NovaCore AI</span>
                <h3 className="text-xl font-black text-foreground">Sistema vivo operando em tempo real</h3>
              </div>
            </div>

            <div className="relative z-10 grid gap-3">
              {afterItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-cyan-200" />
                    <strong className="text-sm font-black text-foreground">{item.title}</strong>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.58, delay: 0.12 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(2,6,23,0.2)] backdrop-blur-2xl"
        >
          <div className="grid gap-3 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="relative rounded-xl border border-white/10 bg-black/22 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black text-muted-foreground">0{index + 1}</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                </div>
                <strong className="block text-sm font-black text-foreground">{step}</strong>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
