import createMiddleware from 'next-intl/middleware'
import { routing } from '@shared/i18n/routing'
import type { ProxyHandler } from '../types'

export const localeHandler: ProxyHandler = async (request, _response, next) => {
  const intlResponse = createMiddleware(routing)(request)

  return next(request, intlResponse)
}
