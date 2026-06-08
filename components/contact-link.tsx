"use client"

import type { MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getClientAuth } from "@/lib/client-auth"

type ContactLinkProps = {
  children: ReactNode
  className?: string
  onNavigate?: () => void
}

export function ContactLink({ children, className, onNavigate }: ContactLinkProps) {
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const clientUser = getClientAuth()

    onNavigate?.()

    if (!clientUser) return

    event.preventDefault()

    if (clientUser.role === "admin") {
      router.push("/admin")
      return
    }

    router.push("/cliente?tab=contato#painel")
  }

  return (
    <Link href="/#cadastro" onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
