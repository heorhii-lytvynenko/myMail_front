'use client'
import { useEffect } from 'react'

// Compatibility for unused account/onboarding providers. Never read tokens in JS.
export function useSessionExpiry(onExpired: () => void) {
  useEffect(() => {
    const controller = new AbortController()
    const check = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) })
        if (!controller.signal.aborted && response.status === 401) onExpired()
      } catch { /* Do not interpret an outage as an expired session. */ }
    }
    const onFocus = () => { void check() }
    void check()
    window.addEventListener('focus', onFocus)
    return () => { controller.abort(); window.removeEventListener('focus', onFocus) }
  }, [onExpired])
}
