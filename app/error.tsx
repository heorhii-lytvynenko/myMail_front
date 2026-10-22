'use client'
import { usePathname } from 'next/navigation'
import { isLocale } from 'i18n/locales'
import { AccountFailure } from './_features/auth/AccountFailure'
export default function Error({ reset }: { reset: () => void }) {
  const segment = usePathname().split('/')[1]
  return <AccountFailure retry={reset} locale={isLocale(segment) ? segment : undefined} />
}
