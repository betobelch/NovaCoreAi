"use client"

import { useEffect, useRef, type CSSProperties } from "react"

const particles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 19) % 100}%`,
  size: 2 + (index % 4),
  delay: (index % 9) * 0.35,
  duration: 5 + (index % 6),
  opacity: 0.24 + (index % 5) * 0.08,
}))

export function AnimatedSiteBackground() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const root = rootRef.current

      if (!root) return

      root.style.setProperty("--novacore-mouse-x", `${event.clientX}px`)
      root.style.setProperty("--novacore-mouse-y", `${event.clientY}px`)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={
        {
          "--novacore-mouse-x": "68vw",
          "--novacore-mouse-y": "24vh",
        } as CSSProperties
      }
    >
      <div className="novacore-ambient-base absolute inset-0" />
      <div className="novacore-mouse-glow absolute inset-0" />
      <div className="novacore-static-glow absolute inset-0 opacity-80" />
      <div className="novacore-aurora-layer novacore-aurora-layer-primary absolute -left-1/4 top-8 h-[44rem] w-[150vw]" />
      <div className="novacore-aurora-layer novacore-aurora-layer-secondary absolute -right-1/3 top-1/3 h-[36rem] w-[140vw]" />
      <div className="novacore-cinematic-grid absolute inset-0" />
      <div className="novacore-energy-lines absolute inset-0" />
      <div className="novacore-scanner absolute inset-x-0 top-0 h-40" />

      {particles.map((particle) => {
        const particleStyle = {
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity,
          "--particle-delay": `${particle.delay}s`,
          "--particle-duration": `${particle.duration}s`,
          "--particle-drift": `${14 + (particle.id % 5) * 2}px`,
        } as CSSProperties

        return <span key={particle.id} className="novacore-particle absolute hidden sm:block" style={particleStyle} />
      })}
    </div>
  )
}
