import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as connect } from '../app/api/integrations/google/connect/route'
import { GET as callback } from '../app/api/integrations/google/callback/route'
import { GET as status } from '../app/api/integrations/google/status/route'
import { POST as disconnect } from '../app/api/integrations/google/disconnect/route'
import { GMAIL_SCOPE } from '../app/_features/google-integration/contracts'
import { createPkce, googleCookieName, openTransaction, sealTransaction, sessionBinding } from '../app/_features/google-integration/oauth'
import { validateAuthorizationUrl } from '../app/_features/google-integration/oauth'

const jar = vi.hoisted(() => new Map<string, string>())
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => jar.has(name) ? { value: jar.get(name) } : undefined }) }))
const fetchMock = vi.fn<typeof fetch>()
const origin = 'https://frontend.example'
const token = `h.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.s`
const oauthState = 's'.repeat(43)
const connected = { status: 'connected', email: 'gmail@example.com', scopes: [GMAIL_SCOPE] }
function post(path: string, requestOrigin = origin) {
  return new NextRequest(`${origin}/api/integrations/google/${path}`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: 'pl' }) })
}
function callbackRequest(query = `code=synthetic-code&state=${oauthState}`) {
  return new NextRequest(`${origin}/api/integrations/google/callback?${query}`)
}
function saveTransaction(overrides = {}) {
  jar.set(googleCookieName(), sealTransaction({ state: oauthState, verifier: createPkce().verifier, binding: sessionBinding(token), expiresAt: Date.now() + 600000, locale: 'pl', ...overrides }))
}
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('BACKEND_URL', 'https://backend.example')
  vi.stubEnv('FRONTEND_URL', origin); vi.stubEnv('GOOGLE_INTEGRATION_ENABLED', 'true')
  vi.stubEnv('GOOGLE_OAUTH_COOKIE_SECRET', Buffer.alloc(32, 7).toString('base64url'))
  vi.stubGlobal('fetch', fetchMock); fetchMock.mockReset(); jar.clear(); jar.set('mymail_session', token)
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('Google initiation', () => {
  it('uses authenticated POST, PKCE and an encrypted browser/session-bound cookie', async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      const body = JSON.parse(options!.body as string)
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      for (const [name, value] of Object.entries({ state: oauthState, code_challenge: body.codeChallenge, code_challenge_method: 'S256', redirect_uri: `${origin}/api/integrations/google/callback`, response_type: 'code', scope: GMAIL_SCOPE, client_id: 'synthetic-client' })) url.searchParams.set(name, String(value))
      return Response.json({ authorizationUrl: url.toString(), state: oauthState, expiresIn: 600 })
    })
    const response = await connect(post('connect'))
    expect(response.status).toBe(200)
    const cookie = response.cookies.get(googleCookieName())!
    expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 })
    const transaction = openTransaction(cookie.value)!
    expect(transaction).toMatchObject({ state: oauthState, binding: sessionBinding(token), locale: 'pl' })
    const body = await response.json()
    expect(Object.keys(body)).toEqual(['url'])
    expect(JSON.stringify(body)).not.toContain(transaction.verifier)
    expect(cookie.value).not.toContain(transaction.verifier)
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/integrations/google/authorize')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST', redirect: 'error' })
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('authorization')).toBe(`Bearer ${token}`)
  })
  it('does not fall back to the insecure legacy redirect contract', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 302, headers: { Location: 'https://accounts.google.com/' } }))
    expect((await connect(post('connect'))).status).toBe(502)
  })
  it.each(['https://attacker.example', 'http://accounts.google.com/o/oauth2/v2/auth', 'https://accounts.google.com:444/o/oauth2/v2/auth'])('rejects an unsafe authorization URL: %s', async authorizationUrl => {
    fetchMock.mockResolvedValue(Response.json({ authorizationUrl, state: oauthState, expiresIn: 600 }))
    const response = await connect(post('connect'))
    expect(response.status).toBe(502)
    expect(response.cookies.get(googleCookieName())).toBeUndefined()
  })
  it('rejects cross-origin mutations before backend access', async () => {
    expect((await connect(post('connect', 'https://attacker.example'))).status).toBe(403)
    expect((await disconnect(post('disconnect', 'https://attacker.example'))).status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('stays disabled until the backend contract is deployed', async () => {
    vi.stubEnv('GOOGLE_INTEGRATION_ENABLED', 'false')
    expect((await connect(post('connect'))).status).toBe(503)
    expect((await status()).status).toBe(503)
    expect((await disconnect(post('disconnect'))).status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('requires an authenticated application session', async () => {
    jar.clear()
    expect((await connect(post('connect'))).status).toBe(401)
    expect((await status()).status).toBe(401)
    expect((await disconnect(post('disconnect'))).status).toBe(401)
  })
  it.each(['state', 'code_challenge', 'redirect_uri', 'scope', 'response_type', 'code_challenge_method'])('rejects changed authorization parameter %s', name => {
    const { challenge } = createPkce()
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    for (const [key, value] of Object.entries({ state: oauthState, code_challenge: challenge, code_challenge_method: 'S256', redirect_uri: `${origin}/api/integrations/google/callback`, scope: GMAIL_SCOPE, response_type: 'code', client_id: 'synthetic-client' })) url.searchParams.set(key, value)
    url.searchParams.set(name, 'changed')
    expect(() => validateAuthorizationUrl(url.toString(), oauthState, challenge)).toThrow()
  })
})

describe('Google callback', () => {
  it('completes with the same session and verifier, clears transaction and returns to the localized account', async () => {
    saveTransaction()
    const transaction = openTransaction(jar.get(googleCookieName()))!
    fetchMock.mockResolvedValue(Response.json(connected))
    const response = await callback(callbackRequest())
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(`${origin}/pl/account?google=connected`)
    expect(response.headers.get('Referrer-Policy')).toBe('no-referrer')
    expect(response.cookies.get(googleCookieName())?.maxAge).toBe(0)
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/integrations/google/complete')
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ code: 'synthetic-code', state: oauthState, codeVerifier: transaction.verifier, redirectUri: `${origin}/api/integrations/google/callback` })
  })
  it.each(['missing', 'swapped', 'tampered', 'expired', 'different-session'])('rejects %s transaction before exchanging credentials', async scenario => {
    saveTransaction()
    if (scenario === 'missing') jar.delete(googleCookieName())
    if (scenario === 'swapped') saveTransaction({ state: 'x'.repeat(43) })
    if (scenario === 'tampered') jar.set(googleCookieName(), 'tampered-cookie')
    if (scenario === 'expired') saveTransaction({ expiresAt: Date.now() - 1 })
    if (scenario === 'different-session') jar.set('mymail_session', 'another-session')
    const response = await callback(callbackRequest())
    expect(response.headers.get('location')).toContain('google=invalid')
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('handles cancellation after validating the transaction', async () => {
    saveTransaction()
    const response = await callback(callbackRequest(`error=access_denied&state=${oauthState}`))
    expect(response.headers.get('location')).toBe(`${origin}/pl/account?google=cancelled`)
    expect(response.cookies.get(googleCookieName())?.maxAge).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('returns to login when the application session expired during consent', async () => {
    saveTransaction(); jar.delete('mymail_session')
    expect((await callback(callbackRequest())).headers.get('location')).toBe(`${origin}/pl/login?reason=session-expired`)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('rejects duplicated callback parameters', async () => {
    saveTransaction()
    await callback(callbackRequest(`code=one&code=two&state=${oauthState}`))
    await callback(callbackRequest(`code=one&state=${oauthState}&state=${oauthState}`))
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('does not report a replay or backend failure as success', async () => {
    saveTransaction(); fetchMock.mockResolvedValue(new Response(null, { status: 400 }))
    expect((await callback(callbackRequest())).headers.get('location')).toContain('google=failed')
  })
  it('clears a backend-rejected session', async () => {
    saveTransaction(); fetchMock.mockResolvedValue(new Response(null, { status: 401 }))
    const response = await callback(callbackRequest())
    expect(response.cookies.get('mymail_session')?.maxAge).toBe(0)
    expect(response.headers.get('location')).toContain('/login?reason=session-expired')
  })
})

describe('connection management', () => {
  it('returns validated status without exposing unexpected backend fields', async () => {
    fetchMock.mockResolvedValue(Response.json({ ...connected, accessToken: 'must-not-be-forwarded' }))
    const response = await status()
    expect(await response.json()).toEqual(connected)
    expect(response.headers.get('cache-control')).toBe('no-store')
  })
  it('rejects malformed status and unexpected permissions', async () => {
    fetchMock.mockResolvedValue(Response.json({ ...connected, scopes: ['https://mail.google.com/'] }))
    expect((await status()).status).toBe(502)
  })
  it('accepts a reconnect-required state after the required permission was lost', async () => {
    const revoked = { status: 'reconnect_required', email: 'gmail@example.com', scopes: [] }
    fetchMock.mockResolvedValue(Response.json(revoked))
    expect(await (await status()).json()).toEqual(revoked)
  })
  it('disconnects only through the authenticated backend operation', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    expect((await disconnect(post('disconnect'))).status).toBe(200)
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/integrations/google')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'DELETE' })
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('authorization')).toBe(`Bearer ${token}`)
  })
  it('does not pretend disconnection succeeded on a backend failure', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }))
    expect((await disconnect(post('disconnect'))).status).toBe(502)
  })
})
