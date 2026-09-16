export const parseJwtPayload = (
  token: string
): Record<string, unknown> | null => {
  try {
    const base64Payload = token.split('.')[1]

    if (!base64Payload) return null
    const decoded = Buffer.from(base64Payload, 'base64url').toString('utf-8')

    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export const isTokenExpiredOrExpiringSoon = (
  token: string | undefined
): boolean => {
  if (!token) {
    return true
  }

  const payload = parseJwtPayload(token)

  if (!payload || typeof payload.exp !== 'number') return true

  const nowSeconds = Math.floor(Date.now() / 1000)

  return payload.exp - nowSeconds < 60
}

type ParsedCookie = {
  value: string
  path?: string
  domain?: string
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export const extractCookieFromSetCookie = (
  setCookieHeader: string | null,
  cookieName: string
): ParsedCookie | null => {
  if (!setCookieHeader) return null

  for (const entry of setCookieHeader.split('\n')) {
    const [pair, ...directives] = entry.split(';').map((s) => s.trim())
    const [name, value] = pair.split('=').map((s) => s.trim())

    if (name !== cookieName) continue

    const cookie: ParsedCookie = { value: value ?? '' }

    for (const directive of directives) {
      const [key, val] = directive.split('=').map((s) => s.trim().toLowerCase())

      if (key === 'httponly') cookie.httpOnly = true
      if (key === 'secure') cookie.secure = true
      if (key === 'path' && val) cookie.path = val
      if (key === 'domain' && val) cookie.domain = val
      if (key === 'expires' && val) cookie.expires = new Date(val)
      if (key === 'samesite' && val === 'strict') cookie.sameSite = 'strict'
      if (key === 'samesite' && val === 'lax') cookie.sameSite = 'lax'
      if (key === 'samesite' && val === 'none') cookie.sameSite = 'none'
    }

    return cookie
  }

  return null
}
