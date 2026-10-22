import { redirect } from 'next/navigation'
import type { AppLocale } from 'i18n/locales'
import { AuthForm } from './AuthForm'
import { AccountFailure } from './AccountFailure'
import { BackendError } from './http'
import { authPath } from './navigation'
import { getCurrentUser, getSessionToken } from './session'

export async function AuthPage({ mode, locale, reason }: { mode: 'login' | 'register'; locale?: AppLocale; reason?: string }) {
  const token = await getSessionToken()
  let user
  try { user = token ? await getCurrentUser(token) : null }
  catch (error) {
    if (error instanceof BackendError) return <AccountFailure locale={locale} forbidden={error.status === 403} />
    throw error
  }
  if (user) redirect(authPath('account', locale))
  return <AuthForm mode={mode} locale={locale} expired={!!token || reason === 'session-expired'} />
}
