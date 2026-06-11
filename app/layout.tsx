import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
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

const themeInitScript = `
(function () {
  try {
    var savedTheme = window.localStorage.getItem('novacore-theme');
    var theme = savedTheme === 'light' ? 'light' : 'dark';
    var root = document.documentElement;

    root.dataset.theme = theme;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch (_) {
    var fallbackRoot = document.documentElement;

    fallbackRoot.dataset.theme = 'dark';
    fallbackRoot.classList.add('dark');
    fallbackRoot.style.colorScheme = 'dark';
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Script id="novacore-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
