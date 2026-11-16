'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AppLocale } from 'i18n/locales'
import { credentialSchema, registrationSchema } from '../contracts'
import { errorCopy } from '../errors'
import { authPath } from '../navigation'
import { okSchema, requestJson, RequestError } from '../request'

export type AuthMode = 'login' | 'register'
export type AuthFieldErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>

export function useAuthForm({ mode, locale }: { mode: AuthMode; locale?: AppLocale }) {
  const router = useRouter()
  const t = useTranslations('auth')
  const signingUp = mode === 'register'
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<AuthFieldErrors>({})

  function describeFields(names: Iterable<unknown>) {
    const messages = {
      email: t('invalidEmail'),
      password: signingUp ? t('shortPassword') : t('invalidPassword'),
      confirmPassword: t('mismatch')
    }
    const errors: AuthFieldErrors = {}
    for (const name of names) {
      if (name === 'email' || name === 'password' || name === 'confirmPassword') {
        errors[name] = messages[name]
      }
    }
    return errors
  }

  async function submit(form: FormData) {
    if (submitting.current) return
    submitting.current = true
    setError('')
    setFields({})

    const values = {
      email: form.get('email'),
      password: form.get('password'),
      ...(signingUp ? { confirmPassword: form.get('confirmPassword') } : {})
    }
    const parsed = (signingUp ? registrationSchema : credentialSchema).safeParse(values)
    if (!parsed.success) {
      setFields(describeFields(parsed.error.issues.map(issue => issue.path[0])))
      submitting.current = false
      return
    }

    setPending(true)
    let navigating = false
    try {
      await requestJson(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      }, okSchema)
      navigating = true
      router.replace(authPath('account', locale))
      router.refresh()
    } catch (failure) {
      if (failure instanceof RequestError) {
        const errors = describeFields(Object.keys(failure.fields).filter(name => failure.fields[name]))
        setFields(errors)
        if (!Object.keys(errors).length) setError(errorCopy(failure.code, t))
      } else {
        setError(t('unavailable'))
      }
    } finally {
      if (!navigating) {
        submitting.current = false
        setPending(false)
      }
    }
  }

  return { pending, error, fields, submit }
}
