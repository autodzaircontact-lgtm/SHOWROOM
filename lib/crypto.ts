import crypto from "crypto"

// We use aes-256-cbc. The key must be exactly 32 bytes (256 bits).
// We'll hash the environment key to guarantee it's exactly 32 bytes regardless of what the user defines.
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || "showroom-auto-dzair-default-secure-key-2026"
const KEY = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest()
const ALGORITHM = "aes-256-cbc"
const IV_LENGTH = 16

export function encryptPayload(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  // Return IV and ciphertext combined, hex-encoded
  return iv.toString("hex") + ":" + encrypted
}

export function decryptPayload(encryptedText: string): string {
  const parts = encryptedText.split(":")
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted format")
  }
  const iv = Buffer.from(parts[0], "hex")
  const encrypted = Buffer.from(parts[1], "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  let decrypted = decipher.update(encrypted)
  // @ts-ignore
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString("utf8")
}
