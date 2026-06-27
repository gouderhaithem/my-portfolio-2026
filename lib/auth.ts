import 'server-only'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from './session'

// Node-only auth helpers (bcrypt + Prisma + cookie mutation). Imported from
// Server Components and Server Actions, never from middleware.

/** Verifies email/password against the admin user. Returns the user or null. */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Hash a dummy value so timing is similar whether or not the user exists.
    await bcrypt.compare(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv')
    return null
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  return { id: user.id, email: user.email }
}

/** Signs the user in by setting an httpOnly session cookie. */
export async function createSession(user: { id: string; email: string }): Promise<void> {
  const token = await signSession({ sub: user.id, email: user.email })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

/** Clears the session cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/** Returns the current session payload, or null when not signed in. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value)
}
