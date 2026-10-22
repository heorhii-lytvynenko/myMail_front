import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { isLocale } from 'i18n/locales'
export const metadata: Metadata = { title: 'My mail', description: 'Your personal email workspace' }
export default async function Layout({ children }: { children: ReactNode }) {
  const requested = (await headers()).get('x-mymail-locale') ?? 'en'
  const locale = isLocale(requested) ? requested : 'en'
  return <html lang={locale === 'ua' ? 'uk' : locale}><body>{children}</body></html>
}
