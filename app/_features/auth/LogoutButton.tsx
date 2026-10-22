'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@shared/ui/Button'
import type { AppLocale } from 'i18n/locales'
import { authPath } from './navigation'
import { okSchema, requestJson } from './request'

export function LogoutButton({ locale, variant = 'primary' }: { locale?: AppLocale; variant?: 'primary' | 'secondary' }) {
  const router = useRouter()
  const t = useTranslations('auth')
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
      setError(t('unavailable'))
      submitting.current = false
      setPending(false)
    }
  }
  return <><Button variant={variant} size="m" loading={pending} onClick={logout}>{pending ? t('loggingOut') : t('logout')}</Button>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}</>
}
