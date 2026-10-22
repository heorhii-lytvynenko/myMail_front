'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { AppLocale } from 'i18n/locales'
import { authCopy } from './copy'
import { authPath } from './navigation'
import { okSchema, requestJson } from './request'

export function LogoutButton({ locale }: { locale?: AppLocale }) {
  const router = useRouter()
  const copy = authCopy(locale)
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function logout() {
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    setError('')
    try {
      await requestJson('/api/auth/logout', { method: 'POST' }, okSchema)
      router.replace(authPath('login', locale))
      router.refresh()
    } catch {
      setError(copy.unavailable)
      submitting.current = false
      setPending(false)
    }
  }
  return <><button type="button" className="primary-button" disabled={pending} onClick={logout}>{pending ? copy.loggingOut : copy.logout}</button>{error && <p role="alert">{error}</p>}</>
}
