export type User = {
  id: string
  name: string
  company?: string
  cpf: string
  email: string
  passwordHash: string
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}
