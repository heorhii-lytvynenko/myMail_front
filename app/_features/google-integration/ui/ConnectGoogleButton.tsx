'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import type { AppLocale } from 'i18n/locales'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Icon } from '@shared/ui/Icon'
import { IconBox } from '@shared/ui/IconBox'
import { Spinner } from '@shared/ui/Spinner'
import { errorCopy } from '../../auth/errors'
import { authPath } from '../../auth/navigation'
import { okSchema, requestJson, RequestError } from '../../auth/request'
import { GMAIL_SCOPE, googleStatusSchema, type GoogleStatus } from '../contracts'

const noticeClassName = 'mb-6 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-7 text-blue-800'

export function ConnectGoogleButton({ locale, enabled, result }: { locale?: AppLocale; enabled: boolean; result?: string }) {
  const router = useRouter()
  const t = useTranslations('auth')
  const dashboard = useTranslations('dashboard')
  const connectionError = t('connectionError')
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
    } else setError(failure instanceof RequestError ? errorCopy(failure.code, t) : connectionError)
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
        } else setError(connectionError)
      })
    return () => controller.abort()
  }, [enabled, attempt, router, locale, connectionError])

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
      setStatus({ status: 'disconnected' }); setNotice(t('disconnectedNotice'))
    } catch (failure) { fail(failure) }
    finally { submitting.current = false; setPending(null) }
  }

  const callbackNotice = result === 'cancelled' ? t('cancelled') : result && result !== 'connected' ? t('callbackFailed') : ''
  const connectionState = !enabled ? 'unavailable' : status?.status ?? (error ? 'error' : 'loading')
  const badgeKey = connectionState === 'reconnect_required' ? 'reconnect' : connectionState === 'error' ? 'connectionError' : connectionState === 'loading' ? 'checking' : connectionState
  const badgeColor = connectionState === 'connected' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
    connectionState === 'reconnect_required' || connectionState === 'error' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-500'

  return <Card className="min-w-0 overflow-hidden border-slate-200 p-0" slotProps={{ content: { className: 'gap-0' } }} role="region" aria-labelledby="gmail-title" aria-busy={!!pending || (enabled && !status && !error)}>
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6 sm:p-7">
      <div className="flex min-w-0 flex-[1_1_240px] items-center gap-3.5">
        <IconBox name="google" className="size-12 rounded-xl border border-slate-200 bg-white" slotProps={{ icon: { className: 'size-7', 'aria-hidden': true } }} />
        <div><Card.Title id="gmail-title" className="mb-1 text-base font-semibold max-md:text-base">{t('gmail')}</Card.Title><p className="text-xs leading-6 text-slate-500">{status?.status === 'connected' ? dashboard('connectedDescription') : dashboard('googleDescription')}</p></div>
      </div>
      <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-4 font-semibold ${badgeColor}`} data-state={connectionState} role="status">
        <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />{dashboard(badgeKey)}
      </span>
    </div>

    <div className="p-6 sm:p-8">
      {enabled && callbackNotice && <p role="status" className={noticeClassName}>{callbackNotice}</p>}
      {notice && <p role="status" className={noticeClassName}>{notice}</p>}
      {!enabled || status?.status === 'disconnected' ? <>
        <div className="text-center">
          <IconBox name="mail" className="mx-auto mb-5 size-21 -rotate-6 rounded-3xl border border-blue-100 bg-blue-50 text-blue-500" slotProps={{ icon: { className: 'size-11 rotate-6', 'aria-hidden': true } }} />
          <h3 className="mb-2.5 text-xl font-semibold tracking-tight">{dashboard('connectTitle')}</h3>
          <p className="text-sm leading-7 text-slate-500">{enabled ? t('disconnected') : t('gmailUnavailable')}</p>
        </div>
        <p className="mx-auto my-6 max-w-[47ch] text-center text-sm leading-7 text-slate-500">{t('consent')}</p>
        <div className="flex justify-center">
          <Button variant="primary" size="xl" iconRight="arrowRight" className="w-full sm:w-auto" onClick={connect} disabled={!enabled || !!pending} loading={pending === 'connect'}>
            <span className="inline-flex items-center gap-3">
              <IconBox name="google" className="size-6 rounded bg-white" slotProps={{ icon: { className: 'size-4', 'aria-hidden': true } }} />
              {pending === 'connect' ? t('connecting') : t('connect')}
            </span>
          </Button>
        </div>
      </> : enabled && !status && !error ? <div className="flex min-h-67 items-center justify-center gap-3 text-sm text-slate-500">
        <Spinner aria-hidden="true" className="size-5 text-blue-600" /><p>{t('checking')}</p>
      </div> : status ? <>
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4.5">
          <IconBox name="google" className="size-11 rounded-full border border-slate-100 bg-white" slotProps={{ icon: { className: 'size-6', 'aria-hidden': true } }} />
          <div className="min-w-0"><p className="mb-1 text-xs text-slate-500">{dashboard('googleAccount')}</p><strong className="text-sm leading-6 font-semibold wrap-anywhere">{status.email ?? dashboard('emailUnavailable')}</strong></div>
        </div>
        <p className="mt-5 mb-3.5 text-sm leading-7 text-slate-600">{status.status === 'connected' ? t('connected') : t('reconnectRequired')}</p>
        {status.status === 'connected' ? status.scopes?.includes(GMAIL_SCOPE) && <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-2 text-xs font-medium text-emerald-700">{dashboard('readOnly')}</span> : <p className="my-5 text-sm leading-7 text-slate-500">{t('consent')}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          {status.status === 'reconnect_required' && <Button onClick={connect} disabled={!!pending} loading={pending === 'connect'}>{pending === 'connect' ? t('connecting') : t('reconnect')}</Button>}
          <Button variant="secondary" onClick={disconnect} disabled={!!pending} loading={pending === 'disconnect'}>{pending === 'disconnect' ? t('disconnecting') : t('disconnect')}</Button>
        </div>
      </> : null}
      {error && <div className="mt-5 grid justify-items-start gap-3.5 text-sm leading-7">
        <p className="text-red-700" role="alert">{error}</p>
        <Button variant="secondary" disabled={!!pending} onClick={() => { setError(''); setStatus(null); setAttempt(value => value + 1) }}>{t('retry')}</Button>
      </div>}
    </div>

    <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs leading-6 text-slate-500">
      <Icon name="lock" size={15} aria-hidden="true" /><span>{dashboard('privateConnection')}</span>
    </div>
  </Card>
}
