import { BarChart3, Clock, TrendingDown, Zap } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Atendimento 24h",
    description: "Seus clientes recebem respostas instantaneas, mesmo fora do horario comercial.",
    stat: "24/7",
    statLabel: "Disponibilidade",
    width: "92%",
  },
  {
    icon: TrendingDown,
    title: "Reducao de Custos",
    description: "Menos tarefas manuais, menos retrabalho e mais produtividade dentro da equipe.",
    stat: "60%",
    statLabel: "Economia media",
    width: "74%",
  },
  {
    icon: Zap,
    title: "Mais Produtividade",
    description: "A IA cuida das rotinas repetitivas enquanto sua equipe foca nas decisoes importantes.",
    stat: "3x",
    statLabel: "Mais eficiencia",
    width: "84%",
  },
  {
    icon: BarChart3,
    title: "Escalabilidade",
    description: "Cresca sem aumentar proporcionalmente o volume de tarefas operacionais.",
    stat: "10x",
    statLabel: "Capacidade de escala",
    width: "88%",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-black uppercase text-primary">Beneficios</span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            O impacto aparece no atendimento, no time e nos numeros
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Automacao com IA deixa a operacao mais rapida, consistente e preparada para crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="premium-card group rounded-2xl border border-border bg-card/58 p-8 shadow-[0_18px_64px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-2 hover:border-primary/45"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-[0_18px_44px_rgba(37,99,235,0.22)] transition-transform duration-300 group-hover:scale-110">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-3xl font-black text-transparent">
                      {benefit.stat}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">{benefit.statLabel}</div>
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-black text-foreground">{benefit.title}</h3>
                <p className="leading-7 text-muted-foreground">{benefit.description}</p>

                <div className="mt-7 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-primary via-cyan-400 to-accent"
                    style={{ width: benefit.width }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
