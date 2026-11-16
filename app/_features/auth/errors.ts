import type messages from '../../../messages/en.json'

type AuthMessage = keyof typeof messages.auth

export function errorCopy(code: string, t: (key: AuthMessage) => string) {
  const messages: Record<string, AuthMessage> = {
    INVALID_CREDENTIALS: 'invalidCredentials', ACCOUNT_EXISTS: 'accountExists',
    REGISTRATION_REJECTED: 'registrationRejected', RATE_LIMITED: 'rateLimited',
    FORBIDDEN: 'forbidden', SESSION_EXPIRED: 'expired',
    VALIDATION_ERROR: 'invalidDetails', GOOGLE_UNAVAILABLE: 'unavailable',
    GOOGLE_REQUEST_REJECTED: 'googleRequestRejected', GOOGLE_CONFLICT: 'googleConflict',
    DISCONNECT_PENDING: 'googleDisconnectPending',
  }
  return t(Object.hasOwn(messages, code) ? messages[code] : 'unavailable')
}
