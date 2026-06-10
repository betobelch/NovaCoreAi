"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react"
import { SoliciteIaLink } from "@/components/solicite-ia-link"

const ctaPoints = ["Atendimento 24h", "CRM organizado", "Follow-up automatico", "Vendas com mais velocidade"]

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.2),transparent_46%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.16),transparent_52%)]" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.6 }}
        className="product-final-cta relative z-10 mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 px-6 py-16 text-center shadow-[0_44px_170px_rgba(37,99,235,0.28)] backdrop-blur-2xl sm:px-10 lg:px-16"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_74px_rgba(56,189,248,0.32)]"
        >
          <Bot className="h-8 w-8" />
        </motion.div>

        <span className="text-sm font-black uppercase text-cyan-300">Ative sua IA operacional</span>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight text-foreground sm:text-5xl md:text-6xl">
          Pare de perder vendas com processos manuais.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          Transforme atendimento, CRM e vendas em um fluxo inteligente operando 24 horas por dia.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {ctaPoints.map((point) => (
            <span
              key={point}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black uppercase text-cyan-50/80"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
              {point}
            </span>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <SoliciteIaLink className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-black text-primary-foreground shadow-[0_28px_90px_rgba(37,99,235,0.42)] transition hover:bg-primary/90 sm:px-10 sm:text-lg">
              Quero minha IA operacional
              <ArrowRight className="h-5 w-5" />
            </SoliciteIaLink>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          Diagnostico e implantacao guiados pela equipe NovaCore AI
        </div>
      </motion.div>
    </section>
  )
}
