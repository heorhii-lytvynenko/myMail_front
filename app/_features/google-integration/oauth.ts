import 'server-only'
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import type { NextResponse } from 'next/server'
import { frontendOrigin } from '../auth/config'
import { cookieOptions } from '../auth/session'
import { GMAIL_SCOPE } from './contracts'

export const GOOGLE_TRANSACTION_MAX_AGE = 600
export function googleCookieName() {
  return process.env.NODE_ENV === 'production' ? '__Host-mymail_google_oauth' : 'mymail_google_oauth'
}

const transactionSchema = z.object({
  state: z.string().regex(/^[A-Za-z0-9_-]{43,128}$/),
  verifier: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  binding: z.string().length(64),
  expiresAt: z.number().int(),
  locale: z.enum(['en', 'pl', 'ua']).optional(),
})
export type GoogleTransaction = z.infer<typeof transactionSchema>

function key() {
  const secret = process.env.GOOGLE_OAUTH_COOKIE_SECRET ?? ''
  if (!/^[A-Za-z0-9_-]{43}$/.test(secret)) throw new Error('Google OAuth cookie secret must encode 32 random bytes as base64url.')
  const value = Buffer.from(secret, 'base64url')
  if (value.length !== 32 || value.toString('base64url') !== secret) throw new Error('Invalid Google OAuth cookie secret.')
  return value
}

export function sessionBinding(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function matches(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function createPkce() {
  const verifier = randomBytes(32).toString('base64url')
  return { verifier, challenge: createHash('sha256').update(verifier).digest('base64url') }
}

export function sealTransaction(value: GoogleTransaction) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  cipher.setAAD(Buffer.from('mymail-google-oauth-v1'))
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(transactionSchema.parse(value))), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url')
}

export function openTransaction(cookie: string | undefined): GoogleTransaction | null {
  if (!cookie || cookie.length > 3000) return null
  try {
    const value = Buffer.from(cookie, 'base64url')
    const decipher = createDecipheriv('aes-256-gcm', key(), value.subarray(0, 12))
    decipher.setAAD(Buffer.from('mymail-google-oauth-v1'))
    decipher.setAuthTag(value.subarray(12, 28))
    const plaintext = Buffer.concat([decipher.update(value.subarray(28)), decipher.final()]).toString('utf8')
    const transaction = transactionSchema.parse(JSON.parse(plaintext))
    return transaction.expiresAt > Date.now() ? transaction : null
  } catch { return null }
}

export function googleRedirectUri() {
  return `${frontendOrigin()}/api/integrations/google/callback`
}

export function validateAuthorizationUrl(value: string, state: string, challenge: string) {
  const url = new URL(value)
  const expected = {
    state, redirect_uri: googleRedirectUri(), code_challenge: challenge,
    code_challenge_method: 'S256', response_type: 'code', scope: GMAIL_SCOPE,
  }
  if (url.origin !== 'https://accounts.google.com' || url.pathname !== '/o/oauth2/v2/auth' ||
      url.username || url.password || url.hash || !url.searchParams.get('client_id') ||
      url.searchParams.getAll('client_id').length !== 1) throw new Error('Invalid Google authorization URL.')
  for (const [name, expectedValue] of Object.entries(expected)) {
    if (url.searchParams.getAll(name).length !== 1 || url.searchParams.get(name) !== expectedValue) {
      throw new Error('Invalid Google authorization parameters.')
    }
  }
  return url.toString()
}

export function clearGoogleTransaction(response: NextResponse) {
  response.cookies.set(googleCookieName(), '', { ...cookieOptions(), maxAge: 0 })
  return response
}
