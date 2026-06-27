import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from './lib/session'

const LOGIN_PATH = '/admin/login'

// Guards the /admin area. Runs on the Edge runtime, so it only verifies the
// signed session cookie (no Prisma/bcrypt here — see lib/auth.ts for those).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySession(token)
  const isLoginPage = pathname === LOGIN_PATH

  // Signed-in users never need the login page.
  if (isLoginPage) {
    if (session) return NextResponse.redirect(new URL('/admin', req.url))
    return NextResponse.next()
  }

  // Everything else under /admin requires a valid session.
  if (!session) {
    const url = new URL(LOGIN_PATH, req.url)
    if (pathname !== '/admin') url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
