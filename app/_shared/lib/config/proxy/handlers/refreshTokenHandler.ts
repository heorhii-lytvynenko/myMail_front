import { IS_DEV } from '@shared/lib/const'
import {
  ACCESS_TOKEN_MAX_AGE,
  ACCESS_TOKEN_NAME,
  extractCookieFromSetCookie,
  isTokenExpiredOrExpiringSoon,
  REFRESH_TOKEN_NAME
} from '@shared/lib/utils/token'
import { authApi } from '@entities/auth'
import type { ProxyHandler } from '../types'

export const refreshTokenHandler: ProxyHandler = async (
  request,
  response,
  next
) => {
  const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value

  const needsRefresh = refreshToken && isTokenExpiredOrExpiringSoon(accessToken)

  if (!needsRefresh) {
    return next(request, response)
  }

  try {
    const {
      data: { accessToken: newAccessToken },
      headers
    } = await authApi.refresh({
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
        'User-Agent': request.headers.get('user-agent') ?? ''
      }
    })

    response.cookies.set(ACCESS_TOKEN_NAME, newAccessToken, {
      sameSite: 'strict',
      httpOnly: false,
      secure: !IS_DEV,
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/'
    })

    const refreshCookie = extractCookieFromSetCookie(
      headers.get('set-cookie'),
      REFRESH_TOKEN_NAME
    )

    if (refreshCookie) {
      const { value, ...options } = refreshCookie

      response.cookies.set(REFRESH_TOKEN_NAME, value, options)
    }

    request.cookies.set(ACCESS_TOKEN_NAME, newAccessToken)

    return next(request, response)
  } catch {
    response.cookies.delete(ACCESS_TOKEN_NAME)
    response.cookies.delete(REFRESH_TOKEN_NAME)

    return next(request, response)
  }
}
