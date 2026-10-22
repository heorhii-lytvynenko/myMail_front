import { notFound } from 'next/navigation'
import { isLocale } from 'i18n/locales'
import { AccountPage } from 'app/_features/auth/AccountPage'
export default async function LocalizedAccountPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ google?: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <AccountPage locale={locale} result={(await searchParams).google} />
}
