import { notFound } from 'next/navigation'
import { isLocale } from 'i18n/locales'
import { AuthPage } from 'app/_features/auth/AuthPage'
export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ reason?: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <AuthPage mode="login" locale={locale} reason={(await searchParams).reason} />
}
