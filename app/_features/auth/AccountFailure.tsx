'use client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { Button } from '@shared/ui/Button'
import { HelperText } from '@shared/ui/HelperText'
import { Section } from '@shared/ui/Section'
import { LogoutButton } from './LogoutButton'
import { AuthLayout } from './ui/AuthLayout'

export function AccountFailure({ locale, forbidden = false, retry }: {
  locale?: AppLocale
  forbidden?: boolean
  retry?: () => void
}) {
  const router = useRouter()
  const t = useTranslations('auth')

  return <AuthLayout labelledBy='account-error'>
    <Section.Panel.Title as='h1' id='account-error' className='text-lg font-bold'>
      {t('loggedIn')}
    </Section.Panel.Title>
    <HelperText role='alert' className='text-base leading-relaxed font-normal text-muted'>
      {forbidden ? t('forbidden') : t('accountError')}
    </HelperText>
    <Button
      variant='secondary'
      onClick={retry ?? (() => router.refresh())}
      className='h-auto rounded-lg border-panelBorder bg-panel px-4 py-3 text-base font-semibold text-foreground focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent'
    >
      {t('retry')}
    </Button>
    <LogoutButton locale={locale} />
  </AuthLayout>
}
