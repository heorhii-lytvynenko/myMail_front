import { expect, it } from 'vitest'
import en from '../messages/en.json'
import pl from '../messages/pl.json'
import ua from '../messages/ua.json'
import { errorCopy } from '../app/_features/auth/errors'

it.each([{ locale: 'pl', messages: pl }, { locale: 'ua', messages: ua }])(
  'keeps auth and dashboard translation keys consistent in $locale',
  ({ messages }) => {
    expect(Object.keys(messages.auth).sort()).toEqual(Object.keys(en.auth).sort())
    expect(Object.keys(messages.dashboard).sort()).toEqual(Object.keys(en.dashboard).sort())
  }
)

it('uses an available localized message when Google integration is unavailable', () => {
  for (const messages of [en, pl, ua]) {
    expect(errorCopy('GOOGLE_UNAVAILABLE', key => messages.auth[key])).toBe(messages.auth.unavailable)
  }
})
