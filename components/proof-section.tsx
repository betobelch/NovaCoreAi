"use client"

import { motion } from "framer-motion"
import { Activity, BarChart3, CheckCircle2, Clock, Database, Radio, TrendingUp, Users, Zap } from "lucide-react"

const proofStats = [
  { value: "+312", label: "leads organizados", width: "88%", icon: Users },
  { value: "64h", label: "economizadas", width: "74%", icon: Clock },
  { value: "18", label: "fluxos ativos", width: "82%", icon: Zap },
  { value: "98%", label: "respostas automatizadas", width: "96%", icon: Activity },
]

const liveRows = [
  { event: "Lead qualificado", channel: "WhatsApp", status: "CRM atualizado", tone: "text-emerald-200" },
  { event: "Reuniao agendada", channel: "Agenda", status: "Vendedor notificado", tone: "text-cyan-200" },
  { event: "Follow-up enviado", channel: "E-mail", status: "Sequencia ativa", tone: "text-violet-200" },
  { event: "Proposta aberta", channel: "Pipeline", status: "Oportunidade quente", tone: "text-amber-200" },
]

const chartBars = ["42%", "68%", "53%", "86%", "74%", "92%", "64%", "81%"]

export function ProofSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/[0.035] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="text-sm font-black uppercase text-cyan-300">Prova operacional</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
              Numeros crescendo enquanto a operacao continua fluindo.
            </h2>
          </div>
          <p className="text-lg leading-8 text-muted-foreground">
            Dashboards vivos, eventos em tempo real e indicadores de produtividade deixam claro onde a IA esta gerando
            velocidade, consistencia e receita.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofStats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="premium-card rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_22px_82px_rgba(2,6,23,0.22)] backdrop-blur-2xl"
            >
              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-black text-emerald-200">
                    ativo
                  </span>
                </div>
                <strong className="block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-200 bg-clip-text text-4xl font-black text-transparent">
                  {stat.value}
                </strong>
                <span className="mt-2 block text-sm font-black text-muted-foreground">{stat.label}</span>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, delay: 0.2 + index * 0.08 }}
                    style={{ width: stat.width }}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.58 }}
          className="proof-dashboard premium-card mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#060914]/78 p-5 shadow-[0_38px_140px_rgba(37,99,235,0.22)] backdrop-blur-2xl"
        >
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
            <section className="rounded-2xl border border-white/10 bg-black/24 p-5">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-black uppercase text-cyan-300">Live operations</span>
                  <h3 className="mt-1 text-xl font-black text-foreground">Eventos acontecendo agora</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                  <Radio className="h-4 w-4" />
                  streaming
                </div>
              </div>

              <div className="grid gap-3">
                {liveRows.map((row, index) => (
                  <motion.div
                    key={row.event}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.38, delay: index * 0.1 }}
                    className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.055] p-3 sm:grid-cols-[1fr_0.8fr_1fr]"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${row.tone}`} />
                      <span className="text-sm font-black text-foreground">{row.event}</span>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{row.channel}</span>
                    <span className="text-sm font-bold text-cyan-100">{row.status}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/24 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-cyan-300">Receita assistida</span>
                  <h3 className="mt-1 text-xl font-black text-foreground">Conversao por etapa</h3>
                </div>
                <BarChart3 className="h-5 w-5 text-cyan-300" />
              </div>

              <div className="flex h-64 items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                {chartBars.map((height, index) => (
                  <motion.div
                    key={`${height}-${index}`}
                    className="min-w-0 flex-1 rounded-t-lg bg-gradient-to-t from-blue-500 via-cyan-300 to-emerald-200 shadow-[0_0_24px_rgba(56,189,248,0.22)]"
                    initial={{ height: "8%" }}
                    whileInView={{ height }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
                  <TrendingUp className="mb-3 h-4 w-4 text-emerald-200" />
                  <strong className="block text-2xl font-black text-foreground">+37%</strong>
                  <span className="text-xs font-bold text-muted-foreground">taxa de resposta</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
                  <Database className="mb-3 h-4 w-4 text-cyan-200" />
                  <strong className="block text-2xl font-black text-foreground">0</strong>
                  <span className="text-xs font-bold text-muted-foreground">lead sem registro</span>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
