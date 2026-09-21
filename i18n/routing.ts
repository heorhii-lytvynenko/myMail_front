import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'uk', 'pl'] as const
export const defaultLocale: LocaleType = 'en'
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export type LocaleType = (typeof locales)[number]
