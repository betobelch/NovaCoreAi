"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"

const STORAGE_KEY = "novacore-theme"
const THEME_CHANGE_EVENT = "novacore-theme-change"

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark"
}

function getSavedTheme(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

function applyTheme(theme: Theme, shouldNotify = true) {
  const root = document.documentElement

  root.dataset.theme = theme
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme

  if (shouldNotify) {
    window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }))
  }
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    return
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const initialTheme = getSavedTheme()

    setTheme(initialTheme)
    applyTheme(initialTheme, false)

    function handleThemeChange(event: Event) {
      const nextTheme = event instanceof CustomEvent ? event.detail : null

      if (isTheme(nextTheme)) {
        setTheme(nextTheme)
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return

      const nextTheme: Theme = event.newValue === "light" ? "light" : "dark"

      setTheme(nextTheme)
      applyTheme(nextTheme, false)
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light"

    setTheme(nextTheme)
    persistTheme(nextTheme)
    applyTheme(nextTheme)
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
