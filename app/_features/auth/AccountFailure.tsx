'use client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { LogoutButton } from './LogoutButton'

export function AccountFailure({ locale, forbidden = false, retry }: { locale?: AppLocale; forbidden?: boolean; retry?: () => void }) {
  const router = useRouter()
  const t = useTranslations('auth')
  return <main className="login-page"><section className="login-panel auth-panel" aria-labelledby="account-error">
    <h1 className="counter-title" id="account-error">{t('loggedIn')}</h1>
    <p role="alert" className="login-copy">{forbidden ? t('forbidden') : t('accountError')}</p>
    <button type="button" className="secondary-button" onClick={retry ?? (() => router.refresh())}>{t('retry')}</button>
    <LogoutButton locale={locale} />
  </section></main>
}
