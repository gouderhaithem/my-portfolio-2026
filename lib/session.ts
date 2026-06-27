import { SignJWT, jwtVerify } from 'jose'

// Edge-safe session primitives: only `jose` (Web Crypto) is used here, so this
// module can be imported from middleware (Edge runtime). Node-only concerns
// (bcrypt, Prisma, cookie mutation) live in `lib/auth.ts`.

export const SESSION_COOKIE = 'admin_session'
/** Session lifetime in seconds (7 days). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export interface SessionPayload {
  /** User id. */
  sub: string
  email: string
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not configured')
  return new TextEncoder().encode(secret)
}

/** Signs a session payload into a short-lived JWT. */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

/** Verifies a session token, returning the payload or null when invalid. */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null
    return { sub: payload.sub, email: payload.email }
  } catch {
    return null
  }
}
