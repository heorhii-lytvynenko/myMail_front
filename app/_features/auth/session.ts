import 'server-only'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { currentUserSchema } from './contracts'
import { backendFetch, BackendError } from './http'

export { backendUrl } from './config'
export const SESSION_COOKIE = 'mymail_session'
export const SESSION_MAX_AGE = 8 * 60 * 60

export function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
}

// A lifetime hint only. The backend must verify signature, issuer and audience.
export function tokenExpiry(token: string): number | null {
  try {
    const payload: unknown = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
    if (typeof payload === 'object' && payload && 'exp' in payload &&
        typeof payload.exp === 'number' && Number.isSafeInteger(payload.exp)) return payload.exp
  } catch { /* Invalid tokens are rejected by the backend. */ }
  return null
}

export function sessionLifetime(token: string, expiresIn?: number): number {
  const expiry = tokenExpiry(token)
  const candidates = [SESSION_MAX_AGE]
  if (expiry !== null) candidates.push(expiry - Math.ceil(Date.now() / 1000))
  if (expiresIn !== undefined) candidates.push(expiresIn)
  if (candidates.length === 1) throw new Error('Backend token expiry is missing.')
  const lifetime = Math.floor(Math.min(...candidates))
  if (lifetime <= 0) throw new Error('Backend returned an expired token.')
  return lifetime
}

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 })
  for (const name of ['access_token', 'refresh_token']) {
    response.cookies.set(name, '', { ...cookieOptions(), maxAge: 0 })
  }
  return response
}

export async function getCurrentUser(token?: string) {
  const accessToken = token ?? await getSessionToken()
  if (!accessToken) return null
  const expiry = tokenExpiry(accessToken)
  if (expiry !== null && expiry <= Date.now() / 1000) return null
  const response = await backendFetch('/api/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }, 10000)
  if (response.status === 401) return null
  if (response.status === 403) throw new BackendError(403, 'Your account does not have permission to open this page.')
  if (!response.ok) throw new BackendError(502)
  try {
    const parsed = currentUserSchema.safeParse(await response.json())
    if (parsed.success) return parsed.data
  } catch { /* Malformed success responses are upstream failures. */ }
  throw new BackendError(502, 'The account service returned an invalid response. Please try again.')
}
