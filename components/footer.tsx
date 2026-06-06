import Link from "next/link"
import { Sparkles } from "lucide-react"

const footerLinks = {
  servicos: [
    { label: "Agentes de IA", href: "#servicos" },
    { label: "Chatbots WhatsApp", href: "#servicos" },
    { label: "Automacao", href: "#servicos" },
    { label: "Integracoes", href: "#servicos" },
  ],
  empresa: [
    { label: "Sobre nos", href: "#sobre" },
    { label: "Contato", href: "#cadastro" },
  ],
}

const socialLinks = [
  { label: "LinkedIn", short: "in" },
  { label: "Instagram", short: "ig" },
  { label: "X", short: "x" },
]

export function Footer() {
  return (
    <footer className="relative border-t border-primary/15 bg-card/42 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="nova-logo-mark flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-cyan-400 to-accent">
                <Sparkles className="relative z-10 h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-foreground">
                NovaCore<span className="text-primary">AI</span>
              </span>
            </Link>

            <p className="mb-6 max-w-md leading-7 text-muted-foreground">
              Transformando processos em resultados com Inteligencia Artificial. Desenvolvemos solucoes que trabalham 24
              horas para o seu negocio.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/70 text-xs font-black text-muted-foreground transition-all hover:border-primary/35 hover:bg-secondary hover:text-foreground"
                  aria-label={link.label}
                >
                  {link.short}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-black text-foreground">Servicos</h4>
            <ul className="space-y-3">
              {footerLinks.servicos.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-black text-foreground">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NovaCore AI. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Politica de Privacidade
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
