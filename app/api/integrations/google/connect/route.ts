import { NextRequest } from 'next/server'
import { z } from 'zod'
import { frontendOrigin, googleIntegrationEnabled } from 'app/_features/auth/config'
import { backendFetch, privateJson, requestOrigin, sameOrigin, serviceFailure } from 'app/_features/auth/http'
import { cookieOptions, getSessionToken } from 'app/_features/auth/session'
import { googleAuthorizationSchema } from 'app/_features/google-integration/contracts'
import { createPkce, googleCookieName, googleRedirectUri, sealTransaction, sessionBinding, validateAuthorizationUrl } from 'app/_features/google-integration/oauth'
import { googleFailure } from 'app/_features/google-integration/server'

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateJson({ message: 'Invalid request origin.' }, 403)
  if (!googleIntegrationEnabled()) return privateJson({ code: 'GOOGLE_UNAVAILABLE' }, 503)
  const token = await getSessionToken()
  if (!token) return privateJson({ code: 'SESSION_EXPIRED' }, 401)
  let body: { locale?: 'en' | 'pl' | 'ua' }
  try { body = z.object({ locale: z.enum(['en', 'pl', 'ua']).optional() }).parse(await request.json()) }
  catch { return privateJson({ code: 'VALIDATION_ERROR' }, 400) }
  try {
    if (requestOrigin(request) !== frontendOrigin()) return privateJson({ message: 'Google connection is unavailable on this address.' }, 403)
    const { verifier, challenge } = createPkce()
    const upstream = await backendFetch('/integrations/google/authorize', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUri: googleRedirectUri(), codeChallenge: challenge, codeChallengeMethod: 'S256' }),
    })
    if (!upstream.ok) return googleFailure(upstream)
    const data = googleAuthorizationSchema.parse(await upstream.json())
    const url = validateAuthorizationUrl(data.authorizationUrl, data.state, challenge)
    const sealed = sealTransaction({ state: data.state, verifier, binding: sessionBinding(token),
      expiresAt: Date.now() + data.expiresIn * 1000, locale: body.locale })
    const response = privateJson({ url })
    response.cookies.set(googleCookieName(), sealed, { ...cookieOptions(), maxAge: data.expiresIn })
    return response
  } catch (error) { return serviceFailure(error) }
}
