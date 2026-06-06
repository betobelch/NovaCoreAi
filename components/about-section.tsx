import { Lightbulb, Target, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Foco em Resultados",
    description: "Cada solucao nasce com uma meta clara: reduzir esforco manual e aumentar performance.",
  },
  {
    icon: Lightbulb,
    title: "Inovacao Aplicada",
    description: "Usamos IA para resolver processos reais, nao para criar complexidade desnecessaria.",
  },
  {
    icon: Users,
    title: "Parceria Continua",
    description: "Acompanhamos a evolucao da operacao para ajustar automacoes conforme o negocio cresce.",
  },
]

const stats = [
  { value: "50+", label: "Projetos entregues" },
  { value: "98%", label: "Satisfacao" },
  { value: "24/7", label: "Suporte" },
]

export function AboutSection() {
  return (
    <section id="sobre" className="relative py-24">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
          <div>
            <span className="text-sm font-black uppercase text-primary">Sobre Nos</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
              IA sob medida para transformar processos em resultado
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A <span className="font-black text-foreground">NovaCore AI</span> nasceu para tornar inteligencia
              artificial acessivel, pratica e conectada ao dia a dia das empresas.
            </p>
            <p className="mt-5 leading-8 text-muted-foreground">
              Nossa equipe une automacao, desenvolvimento e experiencia do usuario para criar solucoes que funcionam na
              operacao real: atendimento, vendas, agenda, CRM e dados no mesmo fluxo.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card/58 p-4 backdrop-blur-xl"
                >
                  <div className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-2xl font-black text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-bold text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="premium-card group rounded-2xl border border-border bg-card/58 p-6 shadow-[0_18px_58px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:translate-x-2 hover:border-primary/45"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/18 to-accent/18 text-primary transition-transform duration-300 group-hover:scale-110">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black text-foreground">{value.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
