'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AppLocale } from 'i18n/locales'
import { authPath } from './navigation'

export function SessionMonitor({ locale, recover = false }: { locale?: AppLocale; recover?: boolean }) {
  const router = useRouter()
  useEffect(() => {
    const controller = new AbortController()
    let pending = false
    const check = async () => {
      if (pending || document.visibilityState === 'hidden') return
      pending = true
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) })
        if (controller.signal.aborted) return
        if (!recover && response.status === 401) {
          router.replace(`${authPath('login', locale)}?reason=session-expired`)
          router.refresh()
        } else if (recover && response.ok) {
          router.replace(authPath('account', locale))
          router.refresh()
        }
      } catch { /* An outage must not log out a valid session. */ }
      finally { pending = false }
    }
    void check()
    const onFocus = () => { void check() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    const timer = recover ? undefined : window.setInterval(onFocus, 60000)
    return () => {
      controller.abort()
      window.clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [router, locale, recover])
  return null
}
