export type ClientAuthUser = {
  id: string
  name: string
  company?: string
  cpf?: string
  phone?: string | null
  email: string
  role?: "client" | "admin"
}

const AUTH_KEY = "novacore-client-auth"

export function saveClientAuth(user: ClientAuthUser, remember: boolean) {
  const storage = remember ? window.localStorage : window.sessionStorage
  const otherStorage = remember ? window.sessionStorage : window.localStorage

  storage.setItem(AUTH_KEY, JSON.stringify(user))
  otherStorage.removeItem(AUTH_KEY)
}

export function getClientAuth() {
  const savedAuth = window.localStorage.getItem(AUTH_KEY) ?? window.sessionStorage.getItem(AUTH_KEY)

  if (!savedAuth) return null

  try {
    return JSON.parse(savedAuth) as ClientAuthUser
  } catch {
    window.localStorage.removeItem(AUTH_KEY)
    window.sessionStorage.removeItem(AUTH_KEY)
    return null
  }
}

export function updateClientAuth(user: ClientAuthUser) {
  const storage = window.localStorage.getItem(AUTH_KEY) ? window.localStorage : window.sessionStorage

  storage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearClientAuth() {
  window.localStorage.removeItem(AUTH_KEY)
  window.sessionStorage.removeItem(AUTH_KEY)
}
