'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { verifyCredentials, createSession } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
  from: z.string().optional(),
})

export interface LoginState {
  error?: string
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    from: formData.get('from'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password)
  if (!user) {
    return { error: 'Incorrect email or password.' }
  }

  await createSession(user)

  redirect(safeAdminPath(parsed.data.from))
}

/**
 * Normalizes a post-login redirect target to a safe in-app `/admin` path,
 * defending against open-redirects and `../` traversal. Falls back to `/admin`.
 */
function safeAdminPath(raw: string | undefined): string {
  if (!raw) return '/admin'
  try {
    const url = new URL(raw, 'http://internal')
    if (url.origin === 'http://internal' && url.pathname.startsWith('/admin')) {
      return url.pathname + url.search
    }
  } catch {
    // fall through
  }
  return '/admin'
}
