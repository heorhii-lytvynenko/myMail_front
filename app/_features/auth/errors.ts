import type messages from '../../../messages/en.json'

type AuthMessage = keyof typeof messages.auth

export function errorCopy(code: string, t: (key: AuthMessage) => string) {
  const messages: Record<string, AuthMessage> = {
    INVALID_CREDENTIALS: 'invalidCredentials', ACCOUNT_EXISTS: 'accountExists',
    REGISTRATION_REJECTED: 'registrationRejected', RATE_LIMITED: 'rateLimited',
    FORBIDDEN: 'forbidden', SESSION_EXPIRED: 'expired',
  }
  return t(messages[code] ?? 'unavailable')
}
