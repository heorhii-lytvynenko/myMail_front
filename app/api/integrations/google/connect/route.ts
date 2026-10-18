import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { backendUrl, SESSION_COOKIE } from '@features/auth/session'

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 })
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: 'Please log in to connect Google.' }, { status: 401 })
  }

  try {
    // Read the OAuth redirect without forwarding the Bearer token to Google.
    const response = await fetch(backendUrl('/integrations/google/connect'), {
      headers: { Authorization: `Bearer ${token}` },
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    })

    if (response.status === 401) {
      return NextResponse.json({ message: 'Your session expired. Please log in again.' }, { status: 401 })
    }
    if (response.status !== 302) {
      return NextResponse.json({ message: 'Google connection is unavailable. Please try again.' }, { status: 502 })
    }

    const location = response.headers.get('location')
    const url = location ? new URL(location) : null
    if (!url || url.protocol !== 'https:' || url.hostname !== 'accounts.google.com' || url.username || url.password) {
      return NextResponse.json({ message: 'The backend returned an invalid Google authorization URL.' }, { status: 502 })
    }

    return NextResponse.json({ url: url.toString() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ message: 'Cannot reach the Google connection service. Please try again.' }, { status: 502 })
  }
}
