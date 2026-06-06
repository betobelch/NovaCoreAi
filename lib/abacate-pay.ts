const ABACATEPAY_BASE_URL = "https://api.abacatepay.com/v2"

type AbacateResponse<T> = {
  data?: T
  error?: string | null
  success?: boolean
}

export type AbacateProduct = {
  id: string
  externalId: string
  name: string
  description?: string | null
  price: number
  currency: "BRL"
  status: string
}

export type AbacateCheckout = {
  id: string
  externalId?: string | null
  url: string
  amount: number
  paidAmount?: number | null
  status: string
  receiptUrl?: string | null
  updatedAt?: string
}

export class AbacatePayError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "AbacatePayError"
    this.status = status
  }
}

function getApiKey() {
  const apiKey = process.env.ABACATEPAY_API_KEY?.trim()

  if (!apiKey) {
    throw new AbacatePayError("Chave da Abacate Pay nao configurada.", 500)
  }

  return apiKey
}

function getApiUrl(path: string, query?: Record<string, string | number | undefined>) {
  const baseUrl = process.env.ABACATEPAY_API_URL?.trim() || ABACATEPAY_BASE_URL
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  return url
}

async function requestAbacate<T>(
  path: string,
  options: {
    method?: "GET" | "POST"
    body?: Record<string, unknown>
    query?: Record<string, string | number | undefined>
  } = {},
) {
  const response = await fetch(getApiUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = (await response.json().catch(() => null)) as AbacateResponse<T> | null
  const message = payload?.error || `Erro ao comunicar com a Abacate Pay (${response.status}).`

  if (!response.ok || payload?.success === false) {
    throw new AbacatePayError(message, response.status)
  }

  if (!payload?.data) {
    throw new AbacatePayError("Resposta da Abacate Pay sem dados.", response.status)
  }

  return payload.data
}

export function getProjectProductExternalId(projectId: string) {
  return `novacore-project-${projectId}`
}

export function getProjectCheckoutExternalId(projectId: string) {
  return `novacore-checkout-${projectId}`
}

export function projectValueToCents(valueInReais: number) {
  return Math.max(1, Math.round(valueInReais * 100))
}

export async function getAbacateProductByExternalId(externalId: string) {
  try {
    return await requestAbacate<AbacateProduct>("/products/get", {
      query: { externalId },
    })
  } catch (error) {
    if (error instanceof AbacatePayError && error.status === 404) {
      return null
    }

    throw error
  }
}

export function createAbacateProduct(input: {
  externalId: string
  name: string
  description?: string
  price: number
}) {
  return requestAbacate<AbacateProduct>("/products/create", {
    method: "POST",
    body: {
      externalId: input.externalId,
      name: input.name,
      description: input.description,
      price: input.price,
      currency: "BRL",
    },
  })
}

export function createAbacateCheckout(input: {
  productId: string
  externalId: string
  returnUrl: string
  completionUrl: string
  metadata?: Record<string, string>
}) {
  return requestAbacate<AbacateCheckout>("/checkouts/create", {
    method: "POST",
    body: {
      items: [{ id: input.productId, quantity: 1 }],
      externalId: input.externalId,
      returnUrl: input.returnUrl,
      completionUrl: input.completionUrl,
      methods: ["PIX", "CARD"],
      metadata: input.metadata ?? {},
    },
  })
}

export function getAbacateCheckout(id: string) {
  return requestAbacate<AbacateCheckout>("/checkouts/get", {
    query: { id },
  })
}
