import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Termos de Uso | NovaCore AI",
  description: "Termos de uso da NovaCore AI.",
}

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen pt-24">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o site
          </Link>

          <div className="premium-card rounded-2xl border border-border bg-card/58 p-8 shadow-[0_24px_86px_rgba(37,99,235,0.12)] backdrop-blur-xl sm:p-10">
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-black text-foreground sm:text-5xl">Termos de Uso</h1>
              <p className="mt-5 leading-8 text-muted-foreground">
                Estes termos orientam o uso do site, area do cliente, painel administrativo, produtos, automacoes,
                comunicacoes e recursos digitais disponibilizados pela NovaCore AI.
              </p>

              <div className="mt-10 grid gap-8 text-muted-foreground">
                <section>
                  <h2 className="text-xl font-black text-foreground">Uso da plataforma</h2>
                  <p className="mt-3 leading-8">
                    O usuario deve fornecer informacoes verdadeiras, manter seus dados de acesso em seguranca e usar a
                    plataforma apenas para finalidades licitas relacionadas aos servicos contratados.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Produtos e projetos</h2>
                  <p className="mt-3 leading-8">
                    Produtos de IA, automacoes e integracoes podem depender de levantamento tecnico, validacao de
                    requisitos, disponibilidade de APIs e aprovacoes do cliente.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Pagamentos</h2>
                  <p className="mt-3 leading-8">
                    Checkouts e status de pagamento podem ser processados por provedores externos, como Abacate Pay,
                    seguindo as regras e confirmacoes recebidas por integracao.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Alteracoes</h2>
                  <p className="mt-3 leading-8">
                    A NovaCore AI pode atualizar estes termos para refletir melhorias do produto, novas funcionalidades,
                    mudancas operacionais ou exigencias legais.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
