import type { AppLocale } from 'i18n/locales'

export function authPath(page: 'login' | 'register' | 'account', locale?: AppLocale) {
  return `${locale ? `/${locale}` : ''}/${page}`
}
