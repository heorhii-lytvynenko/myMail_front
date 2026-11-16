import 'server-only'
import { z } from 'zod'
import { clearSession } from '../auth/session'
import { privateJson, retryAfter } from '../auth/http'
import { clearGoogleTransaction } from './oauth'

const connectionErrorSchema = z.object({
  code: z.literal('DISCONNECT_PENDING'),
})

export async function googleFailure(response: Response) {
  if (response.status === 401) return clearGoogleTransaction(clearSession(privateJson({ code: 'SESSION_EXPIRED' }, 401)))
  const status = [400, 403, 409, 429, 502, 503].includes(response.status) ? response.status : 502
  let code = status === 429 ? 'RATE_LIMITED' : status === 403 ? 'FORBIDDEN' :
    status === 400 ? 'GOOGLE_REQUEST_REJECTED' : status === 409 ? 'GOOGLE_CONFLICT' : 'GOOGLE_UNAVAILABLE'
  // Only forward known application error codes, never provider descriptions.
  if (status === 409) {
    const error = connectionErrorSchema.safeParse(await response.json().catch(() => null))
    if (error.success) code = error.data.code
  }
  return privateJson({ code }, status, retryAfter(response))
}
