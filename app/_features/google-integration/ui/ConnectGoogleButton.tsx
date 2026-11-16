'use client'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { ErrorMessage } from '@shared/ui/ErrorMessage'
import { Spinner } from '@shared/ui/Spinner'
import { useGoogleConnection } from '../lib/useGoogleConnection'

export function ConnectGoogleButton({ locale, enabled, result }: {
  locale?: AppLocale
  enabled: boolean
  result?: string
}) {
  const t = useTranslations('auth')
  const dashboard = useTranslations('dashboard')
  const { pending, status, error, notice, connect, disconnect, retry } = useGoogleConnection({ locale, enabled })
  const checking = enabled && !status && !error
  const canConnect = !enabled || status?.status === 'disconnected'
  const canDisconnect = enabled && status && status.status !== 'disconnected'
  const canRetry = enabled && error && !status
  const callbackNotice = result === 'cancelled' ? t('cancelled') : result && result !== 'connected' ? t('callbackFailed') : ''
  const statusMessage = !enabled ? dashboard('unavailable') :
    status?.status === 'connected' ? t('connected') :
    status?.status === 'reconnect_required' ? t('reconnectRequired') :
    status?.status === 'disconnected' ? t('disconnected') : checking ? t('checking') : ''

  return <Card
    className='min-w-0 rounded-lg border-panelBorder p-6 shadow-none'
    slotProps={{ content: { className: 'gap-4' } }}
    role='region'
    aria-labelledby='gmail-title'
    aria-busy={!!pending || checking}
  >
    <Card.Title id='gmail-title' size='sm' className='text-base font-semibold'>
      {dashboard('googleAccount')}
    </Card.Title>
    {enabled && callbackNotice && <p role='status' className='text-sm text-muted'>{callbackNotice}</p>}
    {notice && <p role='status' className='text-sm text-success'>{notice}</p>}
    {statusMessage && <p role='status' className='flex items-center gap-2 text-sm text-muted'>
      {checking && <Spinner aria-hidden='true' className='text-accent' />}
      {statusMessage}
    </p>}
    {canDisconnect && <p className='text-sm font-medium wrap-anywhere'>
      {status.email ?? dashboard('emailUnavailable')}
    </p>}
    <ErrorMessage role='alert' className='text-sm font-normal text-danger'>{error}</ErrorMessage>
    {(canConnect || canDisconnect || canRetry) && <div className='flex flex-wrap gap-3'>
      {canConnect && <Button onClick={connect} disabled={!enabled || !!pending} loading={pending === 'connect'}>
        {pending === 'connect' ? t('connecting') : t('connect')}
      </Button>}
      {enabled && status?.status === 'reconnect_required' && <Button onClick={connect} disabled={!!pending} loading={pending === 'connect'}>
        {pending === 'connect' ? t('connecting') : t('reconnect')}
      </Button>}
      {canDisconnect && <Button variant='secondary' onClick={disconnect} disabled={!!pending} loading={pending === 'disconnect'}>
        {pending === 'disconnect' ? t('disconnecting') : t('disconnect')}
      </Button>}
      {canRetry && <Button variant='secondary' onClick={retry} disabled={!!pending}>{t('retry')}</Button>}
    </div>}
  </Card>
}
