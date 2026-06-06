import Link from "next/link"
import { ArrowRight, Bot, Calendar, MessageSquare, Plug, ShoppingCart, Workflow } from "lucide-react"

const services = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description: "Assistentes virtuais que entendem contexto, respondem com precisao e seguem o processo da empresa.",
    features: ["Linguagem natural", "Respostas contextuais", "Aprendizado continuo"],
  },
  {
    icon: MessageSquare,
    title: "Chatbots para WhatsApp",
    description: "Atendimento automatico no WhatsApp para responder, qualificar e direcionar clientes 24 horas.",
    features: ["Atendimento automatizado", "Qualificacao de leads", "Integracao com CRM"],
  },
  {
    icon: Workflow,
    title: "Automacao de Processos",
    description: "Fluxos que eliminam tarefas repetitivas e conectam sistemas, equipe e clientes em tempo real.",
    features: ["Fluxos automatizados", "Reducao de erros", "Economia de tempo"],
  },
  {
    icon: Plug,
    title: "Integracao de Sistemas",
    description: "Conecte ferramentas, dados e rotinas em uma operacao centralizada, rastreavel e eficiente.",
    features: ["APIs personalizadas", "Sincronizacao de dados", "Dashboard unificado"],
  },
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description: "Agenda automatizada para confirmar horarios, enviar lembretes e reduzir faltas.",
    features: ["Agendamento automatico", "Lembretes inteligentes", "Calendarios sincronizados"],
  },
  {
    icon: ShoppingCart,
    title: "Automacao de Vendas",
    description: "IA para acompanhar oportunidades, fazer follow-up e apoiar o funil comercial.",
    features: ["Qualificacao de leads", "Follow-up automatico", "Analise preditiva"],
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/24 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-black uppercase text-primary">Nossos Servicos</span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
            Solucoes em IA com cara de operacao real
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Criamos solucoes personalizadas que automatizam tarefas, conectam dados e melhoram a experiencia do cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="premium-card group h-full rounded-2xl border border-border bg-card/58 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-2 hover:border-primary/45"
            >
              <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/18 to-accent/18 text-primary transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-xl font-black text-foreground">{service.title}</h3>
                <p className="mb-5 leading-7 text-muted-foreground">{service.description}</p>

                <ul className="space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(37,99,235,0.7)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div>
            <Link
              href="/produto"
              className="cinematic-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-black text-primary-foreground transition hover:scale-[1.03] hover:bg-primary/90 active:scale-[0.98]"
            >
              Conhecer mais
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
