import { NextRequest, NextResponse } from 'next/server'
import { isLocale } from './i18n/locales'

// Locale metadata only. Authorization remains in server pages and API handlers.
export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split('/')[1]
  const headers = new Headers(request.headers)
  headers.set('x-mymail-locale', isLocale(segment) ? segment : 'en')
  return NextResponse.next({ request: { headers } })
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
