import type { Metadata } from "next"
import { ProdutoExperience } from "./produto-experience"

export const metadata: Metadata = {
  title: "Produto NovaCore AI | IA operacional para empresas",
  description:
    "Conheca a plataforma NovaCore AI para atendimento, vendas, CRM, suporte, agendamentos e processos empresariais com automacoes inteligentes.",
}

export default function ProdutoPage() {
  return <ProdutoExperience />
}
