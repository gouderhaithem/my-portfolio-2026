import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { SESSION_COOKIE, verifySession } from './lib/session'

const LOGIN_PATH = '/admin/login'

const intlMiddleware = createIntlMiddleware(routing)

// Two jobs, split by path:
//  - /admin/* → session guard (Edge-safe: only verifies the signed cookie;
//    no Prisma/bcrypt here — see lib/auth.ts for those).
//  - everything else → next-intl locale routing (/ = en, /fr/* = fr).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
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

  return intlMiddleware(req)
}

export const config = {
  // Public pages (locale routing) + the admin area (auth guard). Skips
  // /api, Next internals, and any path with a file extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
