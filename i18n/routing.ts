import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale, type AppLocale } from './locales'

export { locales, defaultLocale }
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export type LocaleType = AppLocale
