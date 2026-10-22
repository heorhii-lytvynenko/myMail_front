import { redirect } from 'next/navigation'
import type { AppLocale } from 'i18n/locales'
import { googleIntegrationEnabled } from './config'
import { authCopy } from './copy'
import { authPath } from './navigation'
import { getCurrentUser, getSessionToken } from './session'
import { BackendError } from './http'
import { AccountFailure } from './AccountFailure'
import { LogoutButton } from './LogoutButton'
import { SessionMonitor } from './SessionMonitor'
import { ConnectGoogleButton } from '../google-integration/ui/ConnectGoogleButton'

export async function AccountPage({ locale, result }: { locale?: AppLocale; result?: string }) {
  const token = await getSessionToken()
  let user
  try { user = token ? await getCurrentUser(token) : null }
  catch (error) {
    if (error instanceof BackendError) return <AccountFailure locale={locale} forbidden={error.status === 403} />
    throw error
  }
  if (!user) redirect(`${authPath('login', locale)}${token ? '?reason=session-expired' : ''}`)
  const copy = authCopy(locale)
  return <main className="login-page"><section className="login-panel auth-panel" aria-labelledby="account-title">
    <SessionMonitor locale={locale} />
    <span className="login-kicker">myMail</span><h1 className="login-title" id="account-title">{copy.loggedIn}</h1>
    <p className="login-copy">{copy.greeting} {user.email}.</p>
    <ConnectGoogleButton locale={locale} enabled={googleIntegrationEnabled()} result={result} />
    <LogoutButton locale={locale} />
  </section></main>
}
