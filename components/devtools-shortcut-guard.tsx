"use client"

import { useEffect } from "react"

const blockedDevtoolsKeys = new Set(["i", "j", "c"])

function isBlockedShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  if (event.key === "F12") return true
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && blockedDevtoolsKeys.has(key)) return true
  if (event.metaKey && event.altKey && blockedDevtoolsKeys.has(key)) return true
  if ((event.ctrlKey || event.metaKey) && key === "u") return true

  return false
}

export function DevtoolsShortcutGuard() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isBlockedShortcut(event)) return

      event.preventDefault()
      event.stopPropagation()
    }

    function handleContextMenu(event: MouseEvent) {
      event.preventDefault()
    }

    window.addEventListener("keydown", handleKeyDown, true)
    document.addEventListener("contextmenu", handleContextMenu, true)

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("contextmenu", handleContextMenu, true)
    }
  }, [])

  return null
}
