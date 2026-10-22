import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { AppLocale } from '../i18n/locales'
import en from '../messages/en.json'
import pl from '../messages/pl.json'
import ua from '../messages/ua.json'

const messages = { en, pl, ua }

export function renderWithIntl(ui: ReactNode, locale: AppLocale = 'en') {
  return render(<NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="UTC">{ui}</NextIntlClientProvider>)
}
