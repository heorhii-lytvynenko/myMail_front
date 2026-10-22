import { getCurrentUser, clearSession } from 'app/_features/auth/session'
import { privateJson, serviceFailure } from 'app/_features/auth/http'
import { clearGoogleTransaction } from 'app/_features/google-integration/oauth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    // Only expire sessions already rejected by the authentication service.
    return user ? privateJson({ user }) : clearGoogleTransaction(clearSession(privateJson({ code: 'SESSION_EXPIRED' }, 401)))
  } catch (error) {
    return serviceFailure(error)
  }
}
