import { googleIntegrationEnabled } from 'app/_features/auth/config'
import { backendFetch, privateJson, serviceFailure } from 'app/_features/auth/http'
import { getSessionToken } from 'app/_features/auth/session'
import { googleStatusSchema } from 'app/_features/google-integration/contracts'
import { googleFailure } from 'app/_features/google-integration/server'

export async function GET() {
  if (!googleIntegrationEnabled()) return privateJson({ code: 'GOOGLE_UNAVAILABLE' }, 503)
  const token = await getSessionToken()
  if (!token) return privateJson({ code: 'SESSION_EXPIRED' }, 401)
  try {
    const response = await backendFetch('/integrations/google/status', { headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) return googleFailure(response)
    return privateJson(googleStatusSchema.parse(await response.json()))
  } catch (error) { return serviceFailure(error) }
}
