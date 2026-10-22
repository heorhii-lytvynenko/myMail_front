'use client'
import { useRouter } from 'next/navigation'
import type { AppLocale } from 'i18n/locales'
import { authCopy } from './copy'
import { LogoutButton } from './LogoutButton'

export function AccountFailure({ locale, forbidden = false, retry }: { locale?: AppLocale; forbidden?: boolean; retry?: () => void }) {
  const router = useRouter()
  const copy = authCopy(locale)
  return <main className="login-page"><section className="login-panel auth-panel" aria-labelledby="account-error">
    <h1 className="counter-title" id="account-error">{copy.loggedIn}</h1>
    <p role="alert" className="login-copy">{forbidden ? copy.forbidden : copy.accountError}</p>
    <button type="button" className="secondary-button" onClick={retry ?? (() => router.refresh())}>{copy.retry}</button>
    <LogoutButton locale={locale} />
  </section></main>
}
