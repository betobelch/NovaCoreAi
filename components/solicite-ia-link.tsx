"use client"

import type { MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getClientAuth } from "@/lib/client-auth"

type SoliciteIaLinkProps = {
  children: ReactNode
  className?: string
}

export function SoliciteIaLink({ children, className }: SoliciteIaLinkProps) {
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const clientUser = getClientAuth()

    if (!clientUser) return

    event.preventDefault()
    router.push("/cliente?tab=produtos#painel")
  }

  return (
    <Link href="/login" onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
