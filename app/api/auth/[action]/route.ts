import { NextRequest, NextResponse } from 'next/server'
import { backendUrl, SESSION_COOKIE } from 'app/_features/auth/session'

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 })
  }
  const { action } = await context.params
  if (action === 'logout') {
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
    return response
  }
  if (action !== 'login' && action !== 'register') return NextResponse.json({ message: 'Not found.' }, { status: 404 })
  let body: { email?: unknown; password?: unknown; confirmPassword?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ message: 'Invalid request.' }, { status: 400 }) }
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || (action === 'register' && password !== body.confirmPassword)) {
    return NextResponse.json({ message: 'Enter a valid email and password. Password confirmation must match.' }, { status: 400 })
  }
  try {
    const upstream = await fetch(backendUrl(`/api/authentication/${action === 'register' ? 'signIn' : 'login'}`), {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }), cache: 'no-store', signal: AbortSignal.timeout(15000)
    })
    if (!upstream.ok) {
      const message = upstream.status === 401 ? 'Incorrect email or password.' : upstream.status === 409 ? 'An account with this email already exists. Please log in.' : 'Authentication failed. Please try again.'
      return NextResponse.json({ message }, { status: upstream.status >= 400 && upstream.status < 500 ? upstream.status : 502 })
    }
    const data: { accessToken?: string; tokenType?: string } = await upstream.json()
    if (typeof data.accessToken !== 'string' || !data.accessToken) throw new Error('Missing access token')
    const response = NextResponse.json({ ok: true }, { status: action === 'register' ? 201 : 200 })
    response.cookies.set(SESSION_COOKIE, data.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })
    return response
  } catch {
    return NextResponse.json({ message: 'Cannot reach the authentication service. Please try again shortly.' }, { status: 502 })
  }
}
