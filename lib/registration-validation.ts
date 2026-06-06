export type RegistrationForm = {
  name?: string
  company?: string
  cpf?: string
  phone?: string
  email?: string
  password?: string
  passwordConfirm?: string
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function normalizeCpf(value: string) {
  return onlyDigits(value).slice(0, 11)
}

export function formatCpf(value: string) {
  const digits = normalizeCpf(value)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function normalizePhone(value: string) {
  return onlyDigits(value).slice(0, 11)
}

export function formatPhone(value: string) {
  const digits = normalizePhone(value)

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function validateOptionalPhone(value: string) {
  const phone = normalizePhone(value)

  if (!phone) return null

  if (phone.length < 10) {
    return "Informe um telefone com DDD ou deixe em branco."
  }

  return null
}

export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value)

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  const getDigit = (size: number) => {
    const numbers = cpf.slice(0, size)
    const sum = numbers
      .split("")
      .reduce((total, number, index) => total + Number(number) * (size + 1 - index), 0)
    const result = (sum * 10) % 11

    return result === 10 ? 0 : result
  }

  return getDigit(9) === Number(cpf[9]) && getDigit(10) === Number(cpf[10])
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function validatePassword(password: string, passwordConfirm: string) {
  if (!password) {
    return "Informe uma senha."
  }

  if (password.length < 8) {
    return "A senha precisa ter no minimo 8 caracteres."
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "A senha precisa ter letras e numeros."
  }

  if (!passwordConfirm) {
    return "Confirme sua senha."
  }

  if (password !== passwordConfirm) {
    return "As senhas nao coincidem."
  }

  return null
}

export function validateRegistrationForm(form: RegistrationForm | null | undefined) {
  const source = form ?? {}
  const name = source.name?.trim() ?? ""
  const company = source.company?.trim() ?? ""
  const cpf = source.cpf ?? ""
  const phone = source.phone ?? ""
  const email = source.email?.trim() ?? ""
  const password = source.password ?? ""
  const passwordConfirm = source.passwordConfirm ?? ""

  if (!name || !email || !cpf || !password) {
    return "Preencha nome, CPF, e-mail e senha."
  }

  if (name.length < 5 || name.split(/\s+/).length < 2) {
    return "Informe seu nome completo."
  }

  if (company.length > 80) {
    return "O nome da empresa deve ter no maximo 80 caracteres."
  }

  const phoneValidationMessage = validateOptionalPhone(phone)

  if (phoneValidationMessage) {
    return phoneValidationMessage
  }

  if (!isValidCpf(cpf)) {
    return "Informe um CPF valido."
  }

  if (!isValidEmail(email)) {
    return "Informe um e-mail valido."
  }

  return validatePassword(password, passwordConfirm)
}
