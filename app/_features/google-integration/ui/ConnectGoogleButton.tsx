'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import type { AppLocale } from 'i18n/locales'
import { authCopy, errorCopy } from '../../auth/copy'
import { authPath } from '../../auth/navigation'
import { okSchema, requestJson, RequestError } from '../../auth/request'
import { googleStatusSchema, type GoogleStatus } from '../contracts'

export function ConnectGoogleButton({ locale, enabled, result }: { locale?: AppLocale; enabled: boolean; result?: string }) {
  const router = useRouter()
  const copy = authCopy(locale)
  const submitting = useRef(false)
  const [pending, setPending] = useState<'connect' | 'disconnect' | null>(null)
  const [status, setStatus] = useState<GoogleStatus | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const fail = (failure: unknown) => {
    if (failure instanceof RequestError && failure.status === 401) {
      router.replace(`${authPath('login', locale)}?reason=session-expired`)
      router.refresh()
    } else setError(failure instanceof RequestError ? errorCopy(failure.code, copy) : copy.connectionError)
  }
  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    requestJson('/api/integrations/google/status', { signal: controller.signal }, googleStatusSchema)
      .then(setStatus).catch(failure => {
        if (controller.signal.aborted) return
        if (failure instanceof RequestError && failure.status === 401) {
          router.replace(`${authPath('login', locale)}?reason=session-expired`)
          router.refresh()
        } else setError(copy.connectionError)
      })
    return () => controller.abort()
  }, [enabled, attempt, router, locale, copy.connectionError])

  async function connect() {
    if (submitting.current) return
    submitting.current = true
    setPending('connect'); setError(''); setNotice('')
    try {
      const data = await requestJson('/api/integrations/google/connect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale }),
      }, z.object({ url: z.url() }))
      const url = new URL(data.url)
      if (url.origin !== 'https://accounts.google.com' || url.pathname !== '/o/oauth2/v2/auth' || url.username || url.password) throw new Error('Invalid authorization URL')
      window.location.assign(url.toString())
    } catch (failure) { fail(failure); submitting.current = false; setPending(null) }
  }
  async function disconnect() {
    if (submitting.current) return
    submitting.current = true
    setPending('disconnect'); setError(''); setNotice('')
    try {
      await requestJson('/api/integrations/google/disconnect', { method: 'POST' }, okSchema)
      setStatus({ status: 'disconnected' }); setNotice(copy.disconnectedNotice)
    } catch (failure) { fail(failure) }
    finally { submitting.current = false; setPending(null) }
  }
  const callbackNotice = result === 'cancelled' ? copy.cancelled : result && result !== 'connected' ? copy.callbackFailed : ''
  return <section className="login-form google-panel" aria-labelledby="gmail-title" aria-busy={!!pending}>
    <h2 id="gmail-title" className="counter-title">{copy.gmail}</h2>
    {!enabled ? <p className="login-copy">{copy.gmailUnavailable}</p> : <>
      {callbackNotice && <p role="status" className="login-copy">{callbackNotice}</p>}
      {notice && <p role="status">{notice}</p>}
      {!status && !error && <p role="status">{copy.checking}</p>}
      {status && <>
        <p className="login-copy">{status.status === 'connected' ? copy.connected : status.status === 'reconnect_required' ? copy.reconnectRequired : copy.disconnected}</p>
        {status.status !== 'disconnected' && <p className="connection-email">{status.email}</p>}
        {status.status !== 'connected' && <>
          <p className="login-copy">{copy.consent}</p>
          <button type="button" className="primary-button" onClick={connect} disabled={!!pending}>{pending === 'connect' ? copy.connecting : status.status === 'reconnect_required' ? copy.reconnect : copy.connect}</button>
        </>}
        {status.status !== 'disconnected' && <button type="button" className="secondary-button" onClick={disconnect} disabled={!!pending}>{pending === 'disconnect' ? copy.disconnecting : copy.disconnect}</button>}
      </>}
      {error && <><p className="auth-error" role="alert">{error}</p><button type="button" className="secondary-button" disabled={!!pending} onClick={() => { setError(''); setStatus(null); setAttempt(value => value + 1) }}>{copy.retry}</button></>}
    </>}
  </section>
}
