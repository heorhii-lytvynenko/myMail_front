'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { AppLocale } from 'i18n/locales'
import { credentialSchema, registrationSchema } from './contracts'
import { authCopy, errorCopy } from './copy'
import { authPath } from './navigation'
import { okSchema, requestJson, RequestError } from './request'
import { SessionMonitor } from './SessionMonitor'

type FieldErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>
export function AuthForm({ mode, locale, expired = false }: { mode: 'login' | 'register'; locale?: AppLocale; expired?: boolean }) {
  const signingUp = mode === 'register'
  const copy = authCopy(locale)
  const router = useRouter()
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLParagraphElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<FieldErrors>({})
  useEffect(() => {
    if (pending) return
    if (Object.keys(fields).length) formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
    else if (error) alertRef.current?.focus()
  }, [fields, error, pending])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    const form = new FormData(event.currentTarget)
    const values = { email: form.get('email'), password: form.get('password'), ...(signingUp ? { confirmPassword: form.get('confirmPassword') } : {}) }
    const parsed = (signingUp ? registrationSchema : credentialSchema).safeParse(values)
    setError('')
    setFields({})
    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (field === 'email') errors.email = copy.invalidEmail
        if (field === 'password') errors.password = signingUp ? copy.shortPassword : copy.invalidPassword
        if (field === 'confirmPassword') errors.confirmPassword = copy.mismatch
      }
      setFields(errors)
      submitting.current = false
      return
    }
    setPending(true)
    let navigating = false
    try {
      await requestJson(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) }, okSchema)
      navigating = true
      router.replace(authPath('account', locale))
      router.refresh()
    } catch (failure) {
      if (failure instanceof RequestError) {
        const errors: FieldErrors = {}
        if (failure.fields.email) errors.email = copy.invalidEmail
        if (failure.fields.password) errors.password = signingUp ? copy.shortPassword : copy.invalidPassword
        if (failure.fields.confirmPassword) errors.confirmPassword = copy.mismatch
        setFields(errors)
        if (!Object.keys(errors).length) setError(errorCopy(failure.code, copy))
      } else setError(copy.unavailable)
    } finally {
      if (!navigating) { submitting.current = false; setPending(false) }
    }
  }
  return <main className="login-page">
    {expired && <SessionMonitor locale={locale} recover />}
    <section className="login-panel auth-panel" aria-labelledby="auth-title">
      <Link href={authPath('login', locale)} className="login-kicker">myMail</Link>
      <div className="login-heading"><h1 className="login-title" id="auth-title">{signingUp ? copy.create : copy.welcome}</h1>
        <p className="login-copy">{signingUp ? copy.registerCopy : copy.loginCopy}</p></div>
      {expired && <p role="status" className="login-copy">{copy.expired}</p>}
      <form className="login-form" ref={formRef} onSubmit={submit} aria-busy={pending} noValidate>
        <div className="field"><label htmlFor="email">{copy.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} placeholder="you@example.com" required disabled={pending} aria-invalid={!!fields.email} aria-describedby={fields.email ? 'email-error' : undefined} />
          {fields.email && <p id="email-error" className="auth-error">{fields.email}</p>}</div>
        <div className="field"><label htmlFor="password">{copy.password}</label>
          <input id="password" name="password" type="password" autoComplete={signingUp ? 'new-password' : 'current-password'} minLength={signingUp ? 8 : 1} maxLength={1024} required disabled={pending} aria-invalid={!!fields.password} aria-describedby={[signingUp ? 'password-hint' : '', fields.password ? 'password-error' : ''].filter(Boolean).join(' ') || undefined} />
          {signingUp && <p id="password-hint" className="login-copy field-hint">{copy.passwordHint}</p>}
          {fields.password && <p id="password-error" className="auth-error">{fields.password}</p>}</div>
        {signingUp && <div className="field"><label htmlFor="confirmPassword">{copy.confirmation}</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" maxLength={1024} required disabled={pending} aria-invalid={!!fields.confirmPassword} aria-describedby={fields.confirmPassword ? 'confirmation-error' : undefined} />
          {fields.confirmPassword && <p id="confirmation-error" className="auth-error">{fields.confirmPassword}</p>}</div>}
        {error && <p className="auth-error" role="alert" ref={alertRef} tabIndex={-1}>{error}</p>}
        <button className="primary-button" type="submit" disabled={pending}>{pending ? copy.waiting : signingUp ? copy.register : copy.login}</button>
      </form>
      <p className="login-copy">{signingUp ? copy.existing : copy.newUser} <Link className="auth-link" href={authPath(signingUp ? 'login' : 'register', locale)}>{signingUp ? copy.login : copy.register}</Link></p>
    </section>
  </main>
}
