import { notFound } from 'next/navigation'
import { isLocale } from 'i18n/locales'
import type { ReactNode } from 'react'
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return children
}
