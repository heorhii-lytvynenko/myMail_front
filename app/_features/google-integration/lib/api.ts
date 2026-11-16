'use client'
import { z } from 'zod'
import type { AppLocale } from 'i18n/locales'
import { okSchema, requestJson } from '../../auth/request'
import { googleStatusSchema } from '../contracts'

const routes = {
  status: '/api/integrations/google/status',
  connect: '/api/integrations/google/connect',
  disconnect: '/api/integrations/google/disconnect'
} as const

export function getGoogleConnectionStatus(signal: AbortSignal) {
  return requestJson(routes.status, { signal }, googleStatusSchema)
}

export async function getGoogleAuthorizationUrl(locale?: AppLocale) {
  const data = await requestJson(routes.connect, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale })
  }, z.object({ url: z.url() }))
  const url = new URL(data.url)
  if (url.origin !== 'https://accounts.google.com' || url.pathname !== '/o/oauth2/v2/auth' || url.username || url.password) {
    throw new Error('Invalid authorization URL')
  }
  return url.toString()
}

export function disconnectGoogle() {
  return requestJson(routes.disconnect, { method: 'POST' }, okSchema)
}
