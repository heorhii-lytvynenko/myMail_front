import { redirect } from 'next/navigation'
import type { AppLocale } from 'i18n/locales'
import { googleIntegrationEnabled } from './config'
import { authPath } from './navigation'
import { getCurrentUser, getSessionToken } from './session'
import { BackendError } from './http'
import { AccountFailure } from './AccountFailure'
import { SessionMonitor } from './SessionMonitor'
import { AccountDashboard } from '../dashboard/AccountDashboard'

export async function AccountPage({ locale, result }: { locale?: AppLocale; result?: string }) {
  const token = await getSessionToken()
  let user
  try { user = token ? await getCurrentUser(token) : null }
  catch (error) {
    if (error instanceof BackendError) return <AccountFailure locale={locale} forbidden={error.status === 403} />
    throw error
  }
  if (!user) redirect(`${authPath('login', locale)}${token ? '?reason=session-expired' : ''}`)
  return <>
    <SessionMonitor locale={locale} />
    <AccountDashboard email={user.email} locale={locale} googleEnabled={googleIntegrationEnabled()} result={result} />
  </>
}
