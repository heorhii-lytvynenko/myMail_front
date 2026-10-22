import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { googleIntegrationEnabled } from 'app/_features/auth/config'
import { backendFetch, requestOrigin } from 'app/_features/auth/http'
import { clearSession, getSessionToken, tokenExpiry } from 'app/_features/auth/session'
import { googleCompletionSchema } from 'app/_features/google-integration/contracts'
import { clearGoogleTransaction, googleCookieName, googleRedirectUri, matches, openTransaction, sessionBinding } from 'app/_features/google-integration/oauth'

export async function GET(request: NextRequest) {
  const transaction = openTransaction((await cookies()).get(googleCookieName())?.value)
  const locale = transaction?.locale
  const finish = (result: string, login = false) => {
    const path = `${locale ? `/${locale}` : ''}/${login ? 'login?reason=session-expired' : `account?google=${result}`}`
    const response = NextResponse.redirect(new URL(path, requestOrigin(request) || request.nextUrl.origin), 303)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }
  if (!googleIntegrationEnabled()) return finish('unavailable')
  const params = request.nextUrl.searchParams
  const state = params.get('state')
  if (!transaction || !state || params.getAll('state').length !== 1 || !matches(state, transaction.state)) {
    return finish('invalid')
  }
  const token = await getSessionToken()
  if (!token) return clearGoogleTransaction(finish('expired', true))
  const expiry = tokenExpiry(token)
  if (expiry !== null && expiry <= Date.now() / 1000) return clearGoogleTransaction(clearSession(finish('expired', true)))
  if (!matches(sessionBinding(token), transaction.binding)) return clearGoogleTransaction(finish('invalid'))
  if (params.has('error')) {
    if (params.getAll('error').length !== 1 || params.has('code')) return clearGoogleTransaction(finish('invalid'))
    return clearGoogleTransaction(finish(params.get('error') === 'access_denied' ? 'cancelled' : 'failed'))
  }
  const code = params.get('code')
  if (!code || code.length > 4096 || params.getAll('code').length !== 1) return clearGoogleTransaction(finish('invalid'))
  try {
    if (requestOrigin(request) !== new URL(googleRedirectUri()).origin) return clearGoogleTransaction(finish('invalid'))
    const response = await backendFetch('/integrations/google/complete', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state, codeVerifier: transaction.verifier, redirectUri: googleRedirectUri() }),
    })
    if (response.status === 401) return clearGoogleTransaction(clearSession(finish('expired', true)))
    if (!response.ok) return clearGoogleTransaction(finish('failed'))
    googleCompletionSchema.parse(await response.json())
    return clearGoogleTransaction(finish('connected'))
  } catch {
    return clearGoogleTransaction(finish('failed'))
  }
}
