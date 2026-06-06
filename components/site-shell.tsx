"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AnimatedSiteBackground } from "@/components/animated-site-background"
import { DevtoolsShortcutGuard } from "@/components/devtools-shortcut-guard"
import { Header } from "@/components/header"

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname()
  const showHeader = pathname !== "/cliente"
  const showAnimatedBackground = pathname !== "/cliente"

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <DevtoolsShortcutGuard />
      {showAnimatedBackground && <AnimatedSiteBackground />}
      {showHeader && <Header />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
