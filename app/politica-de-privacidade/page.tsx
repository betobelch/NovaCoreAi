import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Politica de Privacidade | NovaCore AI",
  description: "Politica de privacidade da NovaCore AI.",
}

export default function PoliticaDePrivacidadePage() {
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
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-black text-foreground sm:text-5xl">Politica de Privacidade</h1>
              <p className="mt-5 leading-8 text-muted-foreground">
                A NovaCore AI trata dados de clientes com foco em seguranca, clareza e uso estritamente relacionado a
                cadastro, atendimento, projetos, pagamentos, suporte e comunicacoes operacionais.
              </p>

              <div className="mt-10 grid gap-8 text-muted-foreground">
                <section>
                  <h2 className="text-xl font-black text-foreground">Dados coletados</h2>
                  <p className="mt-3 leading-8">
                    Podemos coletar nome, empresa, CPF, telefone, e-mail, senha criptografada, mensagens, anexos,
                    projetos, produtos solicitados, notificacoes e dados de pagamento associados ao atendimento.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Como usamos os dados</h2>
                  <p className="mt-3 leading-8">
                    Os dados sao usados para autenticar usuarios, manter o painel do cliente, organizar projetos,
                    processar solicitacoes, enviar notificacoes, registrar conversas e viabilizar pagamentos.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Compartilhamento</h2>
                  <p className="mt-3 leading-8">
                    Informacoes podem ser compartilhadas com provedores tecnicos necessarios para hospedagem, banco de
                    dados, armazenamento, analytics e pagamentos, sempre dentro da finalidade do servico.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-foreground">Contato</h2>
                  <p className="mt-3 leading-8">
                    Para duvidas sobre privacidade, fale com a equipe pelo e-mail contato@novacoreai.com.
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
