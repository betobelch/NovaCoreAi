import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })

  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, model } = body

    if (!name || !description) {
      return NextResponse.json({ message: "Faltam campos" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        description: String(description).trim(),
        model: String(model || "Produto sob medida").trim(),
      },
    })
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })

    return NextResponse.json({ ok: true, product, products })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ message: "Falta o id do produto" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: String(id) } })

    if (!product) {
      return NextResponse.json({ message: "Produto nao encontrado" }, { status: 404 })
    }

    await prisma.product.delete({ where: { id: String(id) } })

    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })

    return NextResponse.json({ ok: true, products })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Erro no servidor" }, { status: 500 })
  }
}
