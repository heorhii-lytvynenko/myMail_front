export const locales = ['en', 'pl', 'ua'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'en'

export function isLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}
