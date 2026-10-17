import 'server-only'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'mymail_session'
export function backendUrl(path: string) {
  const base = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  return `${base.replace(/\/$/, '')}${path}`
}
export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const response = await fetch(backendUrl('/api/users/me'), {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(10000)
  })
  if (response.status === 401) return null
  if (!response.ok) throw new Error('Unable to load your account. Please try again.')
  const user: { email: string; idpId: string } = await response.json()
  return user
}
