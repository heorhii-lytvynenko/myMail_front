'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function logout() {
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) throw new Error('Could not log out. Please try again.')
      router.replace('/login')
      router.refresh()
    } catch { setError('Could not log out. Please try again.'); setPending(false) }
  }
  return <><button className="primary-button" disabled={pending} onClick={logout}>{pending ? 'Logging out…' : 'Log out'}</button>{error && <p role="alert">{error}</p>}</>
}
