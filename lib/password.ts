import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"

const ITERATIONS = 100_000
const KEY_LENGTH = 64
const DIGEST = "sha512"

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex")

  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`
}

export function verifyPassword(password: string, storedPassword: string) {
  const [scheme, iterationsValue, salt, storedHash] = storedPassword.split(":")

  if (scheme !== "pbkdf2" || !iterationsValue || !salt || !storedHash) {
    return password === storedPassword
  }

  const iterations = Number(iterationsValue)
  const actualHash = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST)
  const expectedHash = Buffer.from(storedHash, "hex")

  if (actualHash.length !== expectedHash.length) return false

  return timingSafeEqual(actualHash, expectedHash)
}
