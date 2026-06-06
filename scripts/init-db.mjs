import { readdir, readFile } from "node:fs/promises"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function splitSqlStatements(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean)
}

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_NovacoreMigration" (
      "name" TEXT NOT NULL PRIMARY KEY,
      "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const appliedMigrations = await prisma.$queryRawUnsafe(`SELECT "name" FROM "_NovacoreMigration" LIMIT 1`)
  const existingProjectTable = await prisma.$queryRawUnsafe(
    `SELECT "name" FROM "sqlite_master" WHERE "type" = 'table' AND "name" = 'Project' LIMIT 1`,
  )

  if (
    Array.isArray(appliedMigrations) &&
    appliedMigrations.length === 0 &&
    Array.isArray(existingProjectTable) &&
    existingProjectTable.length > 0
  ) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_NovacoreMigration" ("name") VALUES (?)`,
      "20260605000000_init",
    )
  }

  const migrationDirectories = (await readdir("prisma/migrations", { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  for (const migrationName of migrationDirectories) {
    const existingMigration = await prisma.$queryRawUnsafe(
      `SELECT "name" FROM "_NovacoreMigration" WHERE "name" = ? LIMIT 1`,
      migrationName,
    )

    if (Array.isArray(existingMigration) && existingMigration.length > 0) continue

    const migrationSql = await readFile(`prisma/migrations/${migrationName}/migration.sql`, "utf8")

    for (const statement of splitSqlStatements(migrationSql)) {
      try {
        await prisma.$executeRawUnsafe(statement)
      } catch (error) {
        if (error instanceof Error && /duplicate column name/i.test(error.message)) {
          continue
        }

        throw error
      }
    }

    await prisma.$executeRawUnsafe(`INSERT INTO "_NovacoreMigration" ("name") VALUES (?)`, migrationName)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
