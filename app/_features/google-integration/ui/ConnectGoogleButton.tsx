'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@shared/lib/const/routes'

export function ConnectGoogleButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function connect() {
    if (pending) return
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/integrations/google/connect', { method: 'POST' })
      if (response.status === 401) {
        router.replace(ROUTES.login)
        router.refresh()
        return
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not connect Google. Please try again.')
      window.location.assign(data.url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not connect Google. Please try again.')
      setPending(false)
    }
  }

  return (
    <div className="login-form">
      <button type="button" className="primary-button" onClick={connect} disabled={pending}>
        {pending ? 'Connecting to Google...' : 'Connect Google'}
      </button>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </div>
  )
}
