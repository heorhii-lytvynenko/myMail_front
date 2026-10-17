'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const signingUp = mode === 'register'
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') || '')
    const confirmPassword = String(form.get('confirmPassword') || '')
    setError('')
    if (signingUp && password !== confirmPassword) { setError('Passwords do not match.'); return }
    setPending(true)
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password, ...(signingUp ? { confirmPassword } : {}) })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Authentication failed.')
      router.replace('/account')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to connect. Please try again.')
      setPending(false)
    }
  }
  return <main className="login-page">
    <section className="login-panel auth-panel" aria-labelledby="auth-title">
      <Link href="/login" className="login-kicker">myMail</Link>
      <div className="login-heading"><h1 className="login-title" id="auth-title">{signingUp ? 'Create your account' : 'Welcome back'}</h1>
        <p className="login-copy">{signingUp ? 'Get started with your personal mail workspace.' : 'Log in to your mail workspace.'}</p></div>
      <form className="login-form" onSubmit={submit} aria-busy={pending}>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={pending} /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={signingUp ? 'new-password' : 'current-password'} required disabled={pending} /></div>
        {signingUp && <div className="field"><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required disabled={pending} /></div>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={pending}>{pending ? 'Please wait…' : signingUp ? 'Create account' : 'Log in'}</button>
      </form>
      <p className="login-copy">{signingUp ? 'Already have an account? ' : 'New to myMail? '}<Link className="auth-link" href={signingUp ? '/login' : '/register'}>{signingUp ? 'Log in' : 'Create an account'}</Link></p>
    </section>
  </main>
}
