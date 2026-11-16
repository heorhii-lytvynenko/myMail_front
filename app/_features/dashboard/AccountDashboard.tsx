import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { Container } from '@shared/ui/Container'
import { authPath } from '../auth/navigation'
import { LogoutButton } from '../auth/LogoutButton'
import { ConnectGoogleButton } from '../google-integration/ui/ConnectGoogleButton'

export function AccountDashboard({ email, locale, googleEnabled, result }: {
  email: string
  locale?: AppLocale
  googleEnabled: boolean
  result?: string
}) {
  const t = useTranslations('dashboard')

  return <div className='min-h-dvh bg-background'>
    <header className='border-b border-panelBorder bg-panel'>
      <Container className='max-w-3xl flex-row items-center gap-6 py-4'>
        <Link href={authPath('account', locale)} className='text-xl font-bold' aria-label='myMail'>
          my<span className='text-accent'>Mail</span>
        </Link>
        <nav className='ml-auto flex items-center gap-4' aria-label={t('navigation')}>
          <Link href={authPath('account', locale)} aria-current='page' className='hidden text-sm text-muted sm:block'>
            {t('dashboard')}
          </Link>
          <LogoutButton locale={locale} variant='secondary' />
        </nav>
      </Container>
    </header>
    <main aria-labelledby='dashboard-title'>
      <Container className='max-w-3xl gap-6 py-8'>
        <div className='space-y-1'>
          <h1 id='dashboard-title' className='text-2xl font-semibold'>{t('dashboard')}</h1>
          <p className='text-sm text-muted wrap-anywhere'>{email}</p>
        </div>
        <ConnectGoogleButton locale={locale} enabled={googleEnabled} result={result} />
      </Container>
    </main>
  </div>
}
