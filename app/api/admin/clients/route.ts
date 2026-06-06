import { NextResponse } from "next/server"
import { listClientUsers } from "@/lib/user-store"

export async function GET() {
  const users = await listClientUsers()

  return NextResponse.json({
    clients: users.map((user) => ({
      id: user.id,
      name: user.name,
      company: user.company ?? "",
      cpf: user.cpf,
      email: user.email,
    })),
  })
}
