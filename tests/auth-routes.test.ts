import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../app/api/auth/[action]/route'
import { GET as session } from '../app/api/auth/session/route'
import { getCurrentUser, sessionLifetime } from '../app/_features/auth/session'
import { backendUrl } from '../app/_features/auth/config'
import { sameOrigin } from '../app/_features/auth/http'

const state = vi.hoisted(() => ({ token: undefined as string | undefined }))
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => name === 'mymail_session' && state.token ? { value: state.token } : undefined }) }))
const fetchMock = vi.fn<typeof fetch>()
const origin = 'https://frontend.example'
const credentials = { email: 'review@example.com', password: ' password with spaces ' }
function jwt(seconds = 3600) {
  return `header.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds })).toString('base64url')}.signature`
}
function submit(action: string, body: unknown = credentials, requestOrigin: string | null = origin) {
  return POST(new NextRequest(`${origin}/api/auth/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(requestOrigin ? { Origin: requestOrigin } : {}) }, body: JSON.stringify(body) }), { params: Promise.resolve({ action }) })
}
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('BACKEND_URL', 'https://backend.example')
  vi.stubEnv('BACKEND_LOGOUT_ENABLED', 'false')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  state.token = undefined
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('authentication boundary', () => {
  it('keeps loopback browser origins distinct despite NextURL normalization', () => {
    const request = new NextRequest('http://127.0.0.1:3000/api/auth/login', {
      headers: { Host: '127.0.0.1:3000', Origin: 'http://127.0.0.1:3000' },
    })
    expect(request.nextUrl.origin).toBe('http://localhost:3000')
    expect(sameOrigin(request)).toBe(true)
    const other = new NextRequest('http://127.0.0.1:3000/api/auth/login', {
      headers: { Host: '127.0.0.1:3000', Origin: 'http://localhost:3000' },
    })
    expect(sameOrigin(other)).toBe(false)
  })
  it('ignores forged forwarding headers when validating the browser origin', () => {
    const request = new NextRequest(`${origin}/api/auth/login`, {
      headers: { Host: 'frontend.example', Origin: 'https://attacker.example', 'X-Forwarded-Host': 'attacker.example' },
    })
    expect(sameOrigin(request)).toBe(false)
  })
  it('logs in without exposing a token and bounds the secure cookie to token expiry', async () => {
    fetchMock.mockResolvedValue(Response.json({ accessToken: jwt(), tokenType: 'Bearer' }))
    const response = await submit('login')
    expect(await response.json()).toEqual({ ok: true })
    const cookie = response.cookies.get('mymail_session')!
    expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
    expect(cookie.maxAge).toBeGreaterThan(3500)
    expect(cookie.maxAge).toBeLessThanOrEqual(3600)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store', redirect: 'error' })
  })
  it('normalizes email whitespace, preserves password spaces and strips confirmation upstream', async () => {
    fetchMock.mockResolvedValue(Response.json({ accessToken: jwt(), tokenType: 'Bearer', idpId: 'auth0|review' }))
    const response = await submit('register', { ...credentials, email: ' Review@Example.com ', confirmPassword: credentials.password })
    expect(response.status).toBe(201)
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ email: 'Review@Example.com', password: credentials.password })
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/api/authentication/signIn')
  })
  it.each([
    { ...credentials, email: 'invalid', confirmPassword: credentials.password },
    { ...credentials, password: 'short', confirmPassword: 'short' },
    { ...credentials, confirmPassword: 'different' },
    null, [],
  ])('rejects invalid registration details without backend calls: %j', async body => {
    expect((await submit('register', body)).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it.each([null, 'https://attacker.example', `${origin}.attacker.example`])('rejects an invalid Origin: %s', async value => {
    expect((await submit('login', credentials, value)).status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('rejects malformed JSON', async () => {
    const request = new NextRequest(`${origin}/api/auth/login`, { method: 'POST', headers: { Origin: origin }, body: '{' })
    expect((await POST(request, { params: Promise.resolve({ action: 'login' }) })).status).toBe(400)
  })
  it.each([[401, 'INVALID_CREDENTIALS'], [409, 'ACCOUNT_EXISTS'], [429, 'RATE_LIMITED'], [400, 'VALIDATION_ERROR'], [403, 'FORBIDDEN'], [500, 'SERVICE_UNAVAILABLE'], [502, 'SERVICE_UNAVAILABLE'], [503, 'SERVICE_UNAVAILABLE']])('maps status %i safely', async (status, code) => {
    fetchMock.mockResolvedValue(Response.json({ message: 'sensitive upstream details' }, { status: status as number, headers: { 'Retry-After': '60' } }))
    const response = await submit('login')
    expect((await response.json()).code).toBe(code)
    expect(response.status).toBe(status === 500 ? 502 : status)
    expect(response.headers.get('Retry-After')).toBe('60')
  })
  it.each(['login', 'register'])('accepts nullable expiry for %s and derives cookie lifetime from JWT exp', async action => {
    fetchMock.mockResolvedValue(Response.json({ accessToken: jwt(600), tokenType: 'Bearer', expiresIn: null, idpId: 'auth0|review' }))
    const response = await submit(action, { ...credentials, confirmPassword: credentials.password })
    expect(response.status).toBe(action === 'register' ? 201 : 200)
    expect(response.cookies.get('mymail_session')?.maxAge).toBeGreaterThan(500)
    expect(response.cookies.get('mymail_session')?.maxAge).toBeLessThanOrEqual(600)
    expect(await response.json()).toEqual({ ok: true })
  })
  it('rejects a registration response missing its required identity', async () => {
    fetchMock.mockResolvedValue(Response.json({ accessToken: jwt(), tokenType: 'Bearer' }))
    const response = await submit('register', { ...credentials, confirmPassword: credentials.password })
    expect(response.status).toBe(502)
    expect(response.cookies.get('mymail_session')).toBeUndefined()
  })
  it('keeps registration rejection distinct from login validation errors', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 'REGISTRATION_REJECTED', message: 'private provider details' }, { status: 400 }))
    const response = await submit('register', { ...credentials, confirmPassword: credentials.password })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ code: 'REGISTRATION_REJECTED' })
  })
  it.each([{}, null, { accessToken: jwt(-10), tokenType: 'Bearer' }, { accessToken: 'opaque', tokenType: 'Bearer' }, { accessToken: 'opaque', tokenType: 'Bearer', expiresIn: null }, { accessToken: jwt(), tokenType: 'other' }])('fails closed on invalid token responses', async body => {
    fetchMock.mockResolvedValue(Response.json(body))
    const response = await submit('login')
    expect(response.status).toBe(502)
    expect(response.cookies.get('mymail_session')).toBeUndefined()
  })
  it('classifies backend timeouts without retrying a credential POST', async () => {
    fetchMock.mockRejectedValue(new DOMException('timeout', 'TimeoutError'))
    expect((await submit('register', { ...credentials, confirmPassword: credentials.password })).status).toBe(504)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('always clears the session, legacy cookies and OAuth transaction during logout', async () => {
    const response = await submit('logout')
    for (const name of ['mymail_session', 'access_token', 'refresh_token', '__Host-mymail_google_oauth']) expect(response.cookies.get(name)?.maxAge).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('attempts configured backend revocation but still logs out on an outage', async () => {
    state.token = jwt()
    vi.stubEnv('BACKEND_LOGOUT_ENABLED', 'true')
    fetchMock.mockRejectedValue(new Error('offline'))
    const response = await submit('logout')
    expect(response.cookies.get('mymail_session')?.maxAge).toBe(0)
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/api/authentication/logout')
  })
  it('rejects unknown auth actions', async () => expect((await submit('unknown')).status).toBe(404))
})

describe('sessions and configuration', () => {
  it('does not authenticate a missing cookie', async () => {
    expect(await getCurrentUser()).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('forwards the token for every authenticated user lookup', async () => {
    state.token = jwt()
    fetchMock.mockImplementation(async () => Response.json({ email: credentials.email, idpId: 'auth0|review' }))
    await getCurrentUser()
    await getCurrentUser()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('authorization')).toBe(`Bearer ${state.token}`)
  })
  it.each([{}, null, { email: credentials.email }, { email: {}, idpId: 'id' }])('rejects malformed current-user data: %j', async body => {
    state.token = jwt()
    fetchMock.mockResolvedValue(Response.json(body))
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 502 })
  })
  it('clears a backend-rejected cookie through the session endpoint', async () => {
    state.token = jwt()
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }))
    const response = await session()
    expect(response.status).toBe(401)
    expect(response.cookies.get('mymail_session')?.maxAge).toBe(0)
  })
  it('preserves sessions on outages and distinguishes forbidden responses', async () => {
    state.token = jwt()
    for (const status of [403, 500, 503]) {
      fetchMock.mockResolvedValue(new Response(null, { status }))
      const response = await session()
      expect(response.status).toBe(status === 403 || status === 503 ? status : 502)
      expect(response.cookies.get('mymail_session')).toBeUndefined()
    }
  })
  it('recognizes expiry while using backend checks for unexpired tokens', async () => {
    state.token = jwt(-1)
    expect(await getCurrentUser()).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('uses the shortest lifetime and refuses missing expiry metadata', () => {
    expect(sessionLifetime(jwt(900), 300)).toBe(300)
    expect(sessionLifetime('opaque', 300)).toBe(300)
    expect(sessionLifetime(jwt(90000))).toBe(28800)
    expect(() => sessionLifetime('opaque')).toThrow()
  })
  it.each(['http://backend.example', 'https://backend.example/api', 'https://user:pass@backend.example', 'https://backend.example?key=value'])('rejects unsafe production backend configuration: %s', value => {
    vi.stubEnv('BACKEND_URL', value)
    expect(() => backendUrl('/api/users/me')).toThrow()
  })
  it('requires server-only production configuration', () => {
    vi.stubEnv('BACKEND_URL', '')
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'https://backend.example')
    expect(() => backendUrl('/api/users/me')).toThrow()
  })
})
