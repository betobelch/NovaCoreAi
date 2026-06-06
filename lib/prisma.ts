import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"

const defaultDatabaseUrl = process.env.NETLIFY ? "file:/tmp/novacore.db" : "file:../data/novacore.db"

process.env.DATABASE_URL ||= defaultDatabaseUrl

function getSqlitePath(databaseUrl: string) {
  if (!databaseUrl.startsWith("file:")) return null

  const filePath = databaseUrl.slice("file:".length)

  return path.isAbsolute(filePath) ? filePath : null
}

function prepareSqliteDatabase() {
  const databasePath = getSqlitePath(process.env.DATABASE_URL ?? "")

  if (!databasePath) return

  mkdirSync(path.dirname(databasePath), { recursive: true })

  if (existsSync(databasePath)) return

  const bundledDatabasePath = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "novacore.db")

  if (existsSync(bundledDatabasePath)) {
    copyFileSync(bundledDatabasePath, databasePath)
  }
}

prepareSqliteDatabase()

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
