"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"

const STORAGE_KEY = "novacore-theme"

function applyTheme(theme: Theme) {
  const root = document.documentElement

  root.dataset.theme = theme
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY)
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light"

    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light"

    setTheme(nextTheme)
    applyTheme(nextTheme)
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  const isLight = theme === "light"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm shadow-black/5 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      aria-label={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
      title={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
    >
      {isLight ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
