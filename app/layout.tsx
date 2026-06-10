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
    icon: [
      { url: '/novacore-ai-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" className={`dark ${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
