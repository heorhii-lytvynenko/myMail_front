import { IS_DEV } from '@shared/lib/const'
import { cookies } from '../cookies'
import { isClient } from '../helpers'
import { _getAccessTokenServer } from './actions'
import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME } from './constans'

export const getAccessToken = async (): Promise<string | null> => {
  if (!isClient()) {
    return _getAccessTokenServer()
  }

  return cookies.get(ACCESS_TOKEN_NAME) ?? null
}

export const setAccessToken = async (token: string): Promise<void> => {
  if (!isClient()) {
    return
  }

  cookies.set(ACCESS_TOKEN_NAME, token, {
    sameSite: 'strict',
    httpOnly: false,
    secure: !IS_DEV,
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/'
  })
}

export const removeAccessToken = async (): Promise<void> => {
  if (!isClient()) {
    return
  }

  cookies.remove(ACCESS_TOKEN_NAME)
}
