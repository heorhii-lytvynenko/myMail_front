import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from './config'

export class BackendError extends Error {
  constructor(public readonly status: number, message = 'The service is temporarily unavailable.') {
    super(message)
    this.name = 'BackendError'
  }
}

export function requestOrigin(request: NextRequest): string {
  // NextURL normalizes loopback IPs to localhost. The actual Host header keeps
  // browser origins distinct. Never use client-supplied X-Forwarded-Host here.
  const host = request.headers.get('host')
  if (!host) return request.nextUrl.origin
  try {
    const url = new URL(`${request.nextUrl.protocol}//${host}`)
    return url.username || url.password || url.pathname !== '/' || url.search || url.hash ? '' : url.origin
  } catch { return '' }
}

export function sameOrigin(request: NextRequest): boolean {
  return request.headers.get('origin') === requestOrigin(request)
}

export function privateJson(body: unknown, status = 200, headers?: HeadersInit) {
  const result = new Headers(headers)
  result.set('Cache-Control', 'no-store')
  result.set('Pragma', 'no-cache')
  return NextResponse.json(body, { status, headers: result })
}

export async function backendFetch(path: string, options: RequestInit = {}, timeout = 15000) {
  const timeoutSignal = AbortSignal.timeout(timeout)
  try {
    return await fetch(backendUrl(path), {
      ...options,
      headers: { Accept: 'application/json', ...Object.fromEntries(new Headers(options.headers)) },
      cache: 'no-store', redirect: 'error',
      signal: options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal,
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new BackendError(504, 'The service took too long to respond. Please try again.')
    }
    throw new BackendError(502)
  }
}

export function retryAfter(response: Response): HeadersInit | undefined {
  const value = response.headers.get('retry-after')
  if (value && (/^\d{1,6}$/.test(value) || Number.isFinite(Date.parse(value)))) return { 'Retry-After': value }
}

export function serviceFailure(error: unknown) {
  return privateJson({ code: error instanceof BackendError && error.status === 403 ? 'FORBIDDEN' : 'SERVICE_UNAVAILABLE', message: error instanceof BackendError ? error.message : 'The service is temporarily unavailable. Please try again.' },
    error instanceof BackendError ? error.status : 502)
}
