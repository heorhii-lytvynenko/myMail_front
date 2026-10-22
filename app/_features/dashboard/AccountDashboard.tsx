import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { Avatar } from '@shared/ui/Avatar'
import { Card } from '@shared/ui/Card'
import { Container } from '@shared/ui/Container'
import { IconBox } from '@shared/ui/IconBox'
import { authPath } from '../auth/navigation'
import { LogoutButton } from '../auth/LogoutButton'
import { ConnectGoogleButton } from '../google-integration/ui/ConnectGoogleButton'

export function AccountDashboard({ email, locale, googleEnabled, result }: {
  email: string; locale?: AppLocale; googleEnabled: boolean; result?: string
}) {
  const t = useTranslations('dashboard')
  const auth = useTranslations('auth')

  return <div className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white">
      <Container className="max-w-[1120px] flex-row items-center gap-6 px-4 sm:gap-12 sm:px-7">
        <Link href={authPath('account', locale)} className="inline-flex items-center gap-2 py-5 text-xl font-bold tracking-tight sm:text-2xl" aria-label="myMail">
          <IconBox name="mail" className="size-9 rounded-lg bg-blue-600 text-white" slotProps={{ icon: { className: 'size-6', 'aria-hidden': true } }} />
          <span>my<span className="text-blue-600">Mail</span></span>
        </Link>
        <nav className="hidden self-stretch sm:flex" aria-label={t('navigation')}>
          <Link href={authPath('account', locale)} aria-current="page" className="grid items-center border-b-2 border-blue-600 px-0.5 text-sm font-semibold text-blue-700">{t('dashboard')}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Avatar fallback={email} className="hidden size-9 text-sm sm:flex" aria-hidden="true" slotProps={{ fallback: { className: 'bg-blue-50 text-blue-700' } }} />
          <LogoutButton locale={locale} variant="secondary" />
        </div>
      </Container>
    </header>

    <main aria-labelledby="dashboard-title">
      <Container className="max-w-[1120px] gap-0 px-4 pt-8 pb-6 sm:px-7 sm:pt-13">
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">{t('workspace')}</p>
          <h1 id="dashboard-title" className="mb-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-7 text-slate-500 sm:text-base">{t('description')}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <ConnectGoogleButton locale={locale} enabled={googleEnabled} result={result} />

          <aside className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border-slate-200 p-6 shadow-none" slotProps={{ content: { className: 'gap-0' } }} role="region" aria-labelledby="account-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Card.Title id="account-title" className="text-sm font-semibold max-md:text-sm">{t('account')}</Card.Title>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />{t('signedIn')}</span>
              </div>
              <Avatar fallback={email} className="mt-6 mb-3.5 size-13 text-xl" aria-hidden="true" slotProps={{ fallback: { className: 'bg-blue-50 text-blue-700' } }} />
              <p className="mb-5 text-sm text-slate-600">{t('accountDescription')}</p>
              <dl className="border-t border-slate-100 pt-4">
                <dt className="mb-1.5 text-xs text-slate-500">{auth('email')}</dt>
                <dd className="text-sm leading-6 wrap-anywhere">{email}</dd>
              </dl>
            </Card>
            <Card className="border-blue-100 bg-blue-50 p-6 shadow-none" slotProps={{ content: { className: 'gap-3' } }} role="region" aria-labelledby="control-title">
              <IconBox name="lock" className="size-7 bg-transparent text-blue-600" slotProps={{ icon: { className: 'size-6', 'aria-hidden': true } }} />
              <Card.Title id="control-title" className="text-sm font-semibold max-md:text-sm">{t('control')}</Card.Title>
              <p className="text-sm leading-7 text-slate-600">{t('controlDescription')}</p>
            </Card>
          </aside>
        </div>

        <footer className="mt-10 flex flex-wrap gap-2 text-xs leading-6 text-slate-500">myMail <span aria-hidden="true">·</span> {t('footer')}</footer>
      </Container>
    </main>
  </div>
}
