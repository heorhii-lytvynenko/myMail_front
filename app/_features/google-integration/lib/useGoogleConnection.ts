'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { errorCopy } from '../../auth/errors'
import { authPath } from '../../auth/navigation'
import { RequestError } from '../../auth/request'
import type { GoogleStatus } from '../contracts'
import { disconnectGoogle, getGoogleAuthorizationUrl, getGoogleConnectionStatus } from './api'

export function useGoogleConnection({ locale, enabled }: { locale?: AppLocale; enabled: boolean }) {
  const router = useRouter()
  const t = useTranslations('auth')
  const connectionError = t('connectionError')
  const submitting = useRef(false)
  const [pending, setPending] = useState<'connect' | 'disconnect' | null>(null)
  const [status, setStatus] = useState<GoogleStatus | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)

  function fail(failure: unknown) {
    if (failure instanceof RequestError && failure.status === 401) {
      router.replace(`${authPath('login', locale)}?reason=session-expired`)
      router.refresh()
    } else {
      setError(failure instanceof RequestError ? errorCopy(failure.code, t) : connectionError)
    }
  }

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    getGoogleConnectionStatus(controller.signal).then(setStatus).catch(failure => {
      if (controller.signal.aborted) return
      if (failure instanceof RequestError && failure.status === 401) {
        router.replace(`${authPath('login', locale)}?reason=session-expired`)
        router.refresh()
      } else {
        setError(connectionError)
      }
    })
    return () => controller.abort()
  }, [enabled, attempt, router, locale, connectionError])

  async function connect() {
    if (submitting.current) return
    submitting.current = true
    setPending('connect')
    setError('')
    setNotice('')
    try {
      window.location.assign(await getGoogleAuthorizationUrl(locale))
    } catch (failure) {
      fail(failure)
      submitting.current = false
      setPending(null)
    }
  }

  async function disconnect() {
    if (submitting.current) return
    submitting.current = true
    setPending('disconnect')
    setError('')
    setNotice('')
    try {
      await disconnectGoogle()
      setStatus({ status: 'disconnected' })
      setNotice(t('disconnectedNotice'))
    } catch (failure) {
      fail(failure)
    } finally {
      submitting.current = false
      setPending(null)
    }
  }

  function retry() {
    setError('')
    setStatus(null)
    setAttempt(value => value + 1)
  }

  return { pending, status, error, notice, connect, disconnect, retry }
}
