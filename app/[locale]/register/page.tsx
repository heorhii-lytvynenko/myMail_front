import { notFound } from 'next/navigation'
import { isLocale } from 'i18n/locales'
import { AuthPage } from 'app/_features/auth/AuthPage'
export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <AuthPage mode="register" locale={locale} />
}
