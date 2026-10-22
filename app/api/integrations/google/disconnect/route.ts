import { NextRequest } from 'next/server'
import { googleIntegrationEnabled } from 'app/_features/auth/config'
import { backendFetch, privateJson, sameOrigin, serviceFailure } from 'app/_features/auth/http'
import { getSessionToken } from 'app/_features/auth/session'
import { clearGoogleTransaction } from 'app/_features/google-integration/oauth'
import { googleFailure } from 'app/_features/google-integration/server'

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateJson({ message: 'Invalid request origin.' }, 403)
  if (!googleIntegrationEnabled()) return privateJson({ code: 'GOOGLE_UNAVAILABLE' }, 503)
  const token = await getSessionToken()
  if (!token) return privateJson({ code: 'SESSION_EXPIRED' }, 401)
  try {
    const response = await backendFetch('/integrations/google', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (response.status !== 204) return googleFailure(response)
    return clearGoogleTransaction(privateJson({ ok: true }))
  } catch (error) { return serviceFailure(error) }
}
