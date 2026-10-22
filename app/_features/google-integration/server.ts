import 'server-only'
import { clearSession } from '../auth/session'
import { privateJson, retryAfter } from '../auth/http'
import { clearGoogleTransaction } from './oauth'

export function googleFailure(response: Response) {
  if (response.status === 401) return clearGoogleTransaction(clearSession(privateJson({ code: 'SESSION_EXPIRED' }, 401)))
  const status = response.status === 403 ? 403 : response.status === 429 ? 429 : 502
  return privateJson({ code: status === 429 ? 'RATE_LIMITED' : status === 403 ? 'FORBIDDEN' : 'GOOGLE_UNAVAILABLE' }, status, retryAfter(response))
}
