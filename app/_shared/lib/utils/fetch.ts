import { unstable_cache } from 'next/cache'

export type FetchParams = Record<string, string | number | boolean | undefined | null>
export interface FetchOptions<TParams = FetchParams> extends Omit<RequestInit, 'cache' | 'next'> {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  params?: TParams
  cache?: { revalidate: number; tags: string[]; keys?: string[] }
}
export interface FetchResponse<T = unknown> { data: T; status: number; headers: Headers }
export interface FetchError extends Error { error?: string; status?: number; _isRetry?: boolean }
export type BeforeRequestHook = (url: string, options: FetchOptions) => Promise<void> | void
export type AfterResponseHook = (response: FetchResponse, url: string, options: FetchOptions) => Promise<void> | void
export type ErrorHook = (error: FetchError, url: string, options: FetchOptions) => Promise<boolean | void> | boolean | void

function mergeHeaders(...values: (HeadersInit | undefined)[]) {
  const headers = new Headers()
  for (const value of values) new Headers(value).forEach((entry, name) => headers.set(name, entry))
  return Object.fromEntries(headers)
}

export class FetchClient {
  private beforeRequestHooks: BeforeRequestHook[] = []
  private responseErrorHooks: ErrorHook[] = []
  private afterResponseHooks: AfterResponseHook[] = []
  constructor(private defaultOptions: FetchOptions) {}

  get<T = unknown, TParams = FetchParams>(url: string, options: FetchOptions<TParams> = {}) {
    return this.makeRequest<T>(url, { ...options, method: 'GET' })
  }
  post<T = unknown, TBody = unknown>(url: string, data?: TBody, options: FetchOptions = {}) {
    return this.send<T>(url, 'POST', data, options)
  }
  put<T = unknown, TBody = unknown>(url: string, data?: TBody, options: FetchOptions = {}) {
    return this.send<T>(url, 'PUT', data, options)
  }
  patch<T = unknown, TBody = unknown>(url: string, data?: TBody, options: FetchOptions = {}) {
    return this.send<T>(url, 'PATCH', data, options)
  }
  delete<T = unknown>(url: string, options: FetchOptions = {}) {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' })
  }
  make<T = unknown>(url: string, options: FetchOptions = {}) { return this.makeRequest<T>(url, options) }
  setHeader(name: string, value: string) { this.defaultOptions.headers = mergeHeaders(this.defaultOptions.headers, { [name]: value }) }
  removeHeader(name: string) {
    const headers = new Headers(this.defaultOptions.headers)
    headers.delete(name)
    this.defaultOptions.headers = Object.fromEntries(headers)
  }
  onBeforeRequest(hook: BeforeRequestHook) { this.beforeRequestHooks.push(hook) }
  offBeforeRequest(hook: BeforeRequestHook) { this.beforeRequestHooks = this.beforeRequestHooks.filter(value => value !== hook) }
  onAfterResponse(hook: AfterResponseHook) { this.afterResponseHooks.push(hook) }
  offAfterResponse(hook: AfterResponseHook) { this.afterResponseHooks = this.afterResponseHooks.filter(value => value !== hook) }
  onResponseError(hook: ErrorHook) { this.responseErrorHooks.push(hook) }
  offError(hook: ErrorHook) { this.responseErrorHooks = this.responseErrorHooks.filter(value => value !== hook) }
  clearHooks() { this.beforeRequestHooks = []; this.afterResponseHooks = []; this.responseErrorHooks = [] }

  private send<T>(url: string, method: string, data: unknown, options: FetchOptions) {
    const headers = new Headers(options.headers)
    let body: BodyInit | undefined
    if (data instanceof FormData) body = data
    else if (data !== undefined) {
      body = JSON.stringify(data)
      headers.set('Content-Type', 'application/json')
    }
    return this.makeRequest<T>(url, { ...options, method, body, headers })
  }

  private async makeRequest<T>(url: string, options: FetchOptions<unknown>): Promise<FetchResponse<T>> {
    const merged = { timeout: 10000, retries: 0, retryDelay: 0, ...this.defaultOptions, ...options }
    const { baseURL = '', params, timeout, retries, retryDelay, cache, ...init } = merged
    const query = new URLSearchParams()
    if (params && typeof params === 'object') {
      for (const [name, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') query.set(name, String(value))
      }
    }
    const fullUrl = baseURL + url + (query.size ? `${url.includes('?') ? '&' : '?'}${query}` : '')
    const originalHeaders = mergeHeaders(this.defaultOptions.headers, options.headers)
    const method = (init.method ?? 'GET').toUpperCase()
    const safeRetry = ['GET', 'HEAD', 'OPTIONS'].includes(method)
    let hookRetried = false

    for (let attempt = 0; ; attempt++) {
      // Each attempt starts from the caller's headers, not stale hook output.
      const request: FetchOptions = { ...init, headers: { ...originalHeaders } }
      try {
        for (const hook of this.beforeRequestHooks) await hook(fullUrl, request)
        const headers = new Headers(request.headers)
        if (request.body instanceof FormData) headers.delete('Content-Type')
        if (cache && (method !== 'GET' || request.credentials !== 'omit' || headers.has('authorization') || headers.has('cookie'))) {
          throw new Error('Only explicitly anonymous GET requests may use shared caching.')
        }
        const execute = async (): Promise<FetchResponse<T>> => {
          const limit = timeout ? AbortSignal.timeout(timeout) : undefined
          const signal = limit && request.signal ? AbortSignal.any([limit, request.signal]) : limit ?? request.signal
          const response = await fetch(fullUrl, { ...request, headers, signal, cache: 'no-store', redirect: 'error' })
          if (!response.ok) {
            const failure: FetchError = new Error(`Request failed (${response.status}).`)
            failure.status = response.status
            const body: unknown = await response.json().catch(() => null)
            if (body && typeof body === 'object' && 'code' in body && typeof body.code === 'string') failure.error = body.code
            throw failure
          }
          const contentType = response.headers.get('content-type') ?? ''
          const data: unknown = response.status === 204 ? undefined : contentType.includes('json') ? await response.json() :
            contentType.startsWith('text/') ? await response.text() : await response.blob()
          return { data: data as T, status: response.status, headers: response.headers }
        }
        let result: FetchResponse<T>
        if (cache && typeof window === 'undefined') {
          const cached = await unstable_cache(async () => {
            const response = await execute()
            return { data: response.data, status: response.status, headers: [...response.headers] }
          }, ['FetchClient', method, fullUrl, ...(cache.keys ?? [])], { tags: cache.tags, revalidate: cache.revalidate })()
          result = { ...cached, headers: new Headers(cached.headers) }
        } else result = await execute()
        for (const hook of this.afterResponseHooks) await hook(result, fullUrl, request)
        return result
      } catch (error) {
        const failure: FetchError = error instanceof Error ? error : new Error('Request failed.')
        failure._isRetry = hookRetried
        let hookRetry = false
        if (!hookRetried) for (const hook of this.responseErrorHooks) if (await hook(failure, fullUrl, request)) hookRetry = true
        const transient = failure.status === undefined || failure.status >= 500
        if (hookRetry || (safeRetry && transient && attempt < retries && failure.name !== 'AbortError')) {
          if (hookRetry) hookRetried = true
          if (retryDelay) await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }
        throw failure
      }
    }
  }
}
