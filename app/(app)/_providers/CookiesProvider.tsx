'use client'
import type { PropsWithChildren } from 'react'
import { CookiesProvider as ReactCookiesProvider } from 'react-cookie'
import { IS_DEV } from '@shared/lib/const'

export const CookiesProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactCookiesProvider
      defaultSetOptions={{
        sameSite: 'lax',
        secure: !IS_DEV,
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      }}
    >
      {children}
    </ReactCookiesProvider>
  )
}
