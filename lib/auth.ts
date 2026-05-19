import { cookies } from "next/headers"

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"
const SESSION_COOKIE_NAME = "admin_session"

export interface AdminSession {
  username: string
  loginTime: number
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function createSession(username: string): Promise<string> {
  const session: AdminSession = {
    username,
    loginTime: Date.now(),
  }
  return Buffer.from(JSON.stringify(session)).toString("base64")
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie) {
    return null
  }
  
  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    )
    
    // Session expires after 24 hours
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
      return null
    }
    
    return session
  } catch {
    return null
  }
}

export async function setSessionCookie(sessionToken: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
