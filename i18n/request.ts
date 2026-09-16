import { getRequestConfig } from 'next-intl/server'
import type { AbstractIntlMessages } from 'use-intl/core'
import { defaultLocale, isLocale, type AppLocale } from './locales'

type MessagesModule = {
  default: AbstractIntlMessages
}

const dictionaries: Record<AppLocale, () => Promise<MessagesModule>> = {
  en: () => import('../messages/en.json') as Promise<MessagesModule>,
  pl: () => import('../messages/pl.json') as Promise<MessagesModule>,
  ua: () => import('../messages/ua.json') as Promise<MessagesModule>
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requestedLocale = locale ?? (await requestLocale)
  const resolvedLocale =
    requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale

  return {
    locale: resolvedLocale,
    messages: (await dictionaries[resolvedLocale]()).default
  }
})
