import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SiteShell } from '@/components/site-shell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'NovaCore AI | Automacao Inteligente para sua Empresa',
  description: 'Desenvolvemos agentes de IA, chatbots e automacoes que trabalham 24 horas para o seu negocio. Transforme processos em resultados com inteligencia artificial.',
  keywords: ['automacao', 'inteligencia artificial', 'chatbots', 'agentes de IA', 'automacao de processos'],
  generator: 'v0.app',
  icons: {
    icon: '/novacore-ai-icon.png',
    shortcut: '/novacore-ai-icon.png',
    apple: '/novacore-ai-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
