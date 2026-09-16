'use server'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from './constans'

export const _getAccessTokenServer = async () => {
  const cookieStore = await cookies()

  return cookieStore.get(ACCESS_TOKEN_NAME)?.value ?? null
}

export const removeRefreshToken = async () => {
  const cookieStore = await cookies()

  cookieStore.delete(REFRESH_TOKEN_NAME)
}

export const removeTokens = async () => {
  const cookieStore = await cookies()

  cookieStore.delete(REFRESH_TOKEN_NAME)
  cookieStore.delete(ACCESS_TOKEN_NAME)
}
