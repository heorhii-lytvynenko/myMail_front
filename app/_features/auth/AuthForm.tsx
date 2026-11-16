'use client'
import Link from 'next/link'
import { useEffect, useRef, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { Button } from '@shared/ui/Button'
import { ErrorMessage } from '@shared/ui/ErrorMessage'
import { HelperText } from '@shared/ui/HelperText'
import { Section } from '@shared/ui/Section'
import { useAuthForm, type AuthMode } from './lib/useAuthForm'
import { authPath } from './navigation'
import { SessionMonitor } from './SessionMonitor'
import { AuthFields } from './ui/AuthFields'
import { AuthLayout } from './ui/AuthLayout'

export function AuthForm({ mode, locale, expired = false }: {
  mode: AuthMode
  locale?: AppLocale
  expired?: boolean
}) {
  const signingUp = mode === 'register'
  const t = useTranslations('auth')
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLParagraphElement>(null)
  const { pending, error, fields, submit } = useAuthForm({ mode, locale })

  useEffect(() => {
    if (pending) return
    if (Object.keys(fields).length) {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
    } else if (error) {
      alertRef.current?.focus()
    }
  }, [fields, error, pending])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit(new FormData(event.currentTarget))
  }

  return <AuthLayout labelledBy='auth-title'>
    {expired && <SessionMonitor locale={locale} recover />}
    <Link
      href={authPath('login', locale)}
      className='w-fit text-sm font-bold text-accent-strong uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent'
    >
      myMail
    </Link>
    <Section.Panel.Block className='gap-2'>
      <Section.Panel.Title
        as='h1'
        id='auth-title'
        className='text-3xl leading-none font-bold text-primaryText md:text-4xl lg:text-5xl'
      >
        {signingUp ? t('create') : t('welcome')}
      </Section.Panel.Title>
      <HelperText className='max-w-prose text-base leading-relaxed font-normal text-muted'>
        {signingUp ? t('registerCopy') : t('loginCopy')}
      </HelperText>
    </Section.Panel.Block>
    {expired && <HelperText role='status' className='text-base leading-relaxed font-normal text-muted'>
      {t('expired')}
    </HelperText>}
    <form ref={formRef} onSubmit={handleSubmit} aria-busy={pending} noValidate className='grid gap-4'>
      <AuthFields mode={mode} pending={pending} errors={fields} />
      <ErrorMessage ref={alertRef} role='alert' tabIndex={-1} className='text-base font-normal text-danger'>
        {error}
      </ErrorMessage>
      <Button
        type='submit'
        loading={pending}
        disabled={pending}
        className='h-auto rounded-lg bg-accent px-4 py-3 text-base font-bold hover:bg-accent-strong before:hidden disabled:cursor-wait aria-disabled:opacity-65 data-[loading=true]:opacity-65 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent'
      >
        {pending ? t('waiting') : signingUp ? t('register') : t('login')}
      </Button>
    </form>
    <p className='max-w-prose text-base leading-relaxed text-muted'>
      {signingUp ? t('existing') : t('newUser')}{' '}
      <Link
        href={authPath(signingUp ? 'login' : 'register', locale)}
        className='font-semibold text-accent-strong focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent'
      >
        {signingUp ? t('login') : t('register')}
      </Link>
    </p>
  </AuthLayout>
}
