import { NextRequest } from 'next/server'
import { credentialSchema, registrationSchema, registrationResponseSchema, tokenResponseSchema } from 'app/_features/auth/contracts'
import { backendFetch, privateJson, retryAfter, sameOrigin, serviceFailure } from 'app/_features/auth/http'
import { clearSession, cookieOptions, getSessionToken, SESSION_COOKIE, sessionLifetime } from 'app/_features/auth/session'
import { clearGoogleTransaction } from 'app/_features/google-integration/oauth'

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!sameOrigin(request)) return privateJson({ message: 'Invalid request origin.' }, 403)
  const { action } = await context.params
  if (action === 'logout') {
    const token = await getSessionToken()
    // Enable backend revocation only after deploying the documented contract.
    if (token && process.env.BACKEND_LOGOUT_ENABLED === 'true') {
      try {
        await backendFetch('/api/authentication/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }, 3000)
      } catch { /* Local logout must work even during a backend outage. */ }
    }
    return clearGoogleTransaction(clearSession(privateJson({ ok: true })))
  }
  if (action !== 'login' && action !== 'register') return privateJson({ message: 'Not found.' }, 404)
  let body: unknown
  try { body = await request.json() } catch { return privateJson({ message: 'Enter valid account details.' }, 400) }
  const parsed = (action === 'register' ? registrationSchema : credentialSchema).safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0])
      fields[field] = field === 'email' ? 'EMAIL_INVALID' : field === 'confirmPassword' ? 'PASSWORD_MISMATCH' : 'PASSWORD_INVALID'
    }
    return privateJson({ code: 'VALIDATION_ERROR', fields }, 400)
  }
  const { email, password } = parsed.data
  try {
    const upstream = await backendFetch(`/api/authentication/${action === 'register' ? 'signIn' : 'login'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    })
    if (!upstream.ok) {
      const code = upstream.status === 401 ? 'INVALID_CREDENTIALS' : upstream.status === 409 ? 'ACCOUNT_EXISTS' :
        upstream.status === 429 ? 'RATE_LIMITED' : upstream.status === 400 ? (action === 'register' ? 'REGISTRATION_REJECTED' : 'VALIDATION_ERROR') :
        upstream.status === 403 ? 'FORBIDDEN' : 'SERVICE_UNAVAILABLE'
      return privateJson({ code }, upstream.status >= 400 && upstream.status < 500 || upstream.status === 503 ? upstream.status : 502, retryAfter(upstream))
    }
    const token = (action === 'register' ? registrationResponseSchema : tokenResponseSchema).parse(await upstream.json())
    const maxAge = sessionLifetime(token.accessToken, token.expiresIn)
    const response = clearGoogleTransaction(privateJson({ ok: true }, action === 'register' ? 201 : 200))
    response.cookies.set(SESSION_COOKIE, token.accessToken, { ...cookieOptions(), maxAge })
    for (const name of ['access_token', 'refresh_token']) response.cookies.set(name, '', { ...cookieOptions(), maxAge: 0 })
    return response
  } catch (error) {
    return serviceFailure(error)
  }
}
