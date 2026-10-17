import { unstable_cache } from 'next/cache'

export type FetchParams = Record<
  string,
  string | number | boolean | undefined | null
>
export interface FetchOptions<TParams = FetchParams> extends Omit<
  RequestInit,
  'cache' | 'next'
> {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  params?: TParams
  cache?: {
    revalidate: number
    tags: string[]
    keys?: string[]
  }
}

export interface FetchResponse<T = any> {
  data: T
  status: number
  headers: Headers
}

export interface FetchError extends Error {
  message: string
  error?: string
  status?: number
  _isRetry?: boolean
}

export type BeforeRequestHook = (
  url: string,
  options: FetchOptions
) => Promise<void> | void
export type ErrorHook = (
  error: FetchError,
  url: string,
  options: FetchOptions
) => Promise<boolean | void> | boolean | void

export type AfterResponseHook = (
  response: FetchResponse<any>,
  url: string,
  options: FetchOptions
) => Promise<void> | void

export class FetchClient {
  private defaultOptions: FetchOptions
  private beforeRequestHooks: BeforeRequestHook[] = []
  private responseErrorHooks: ErrorHook[] = []
  private afterResponseHooks: AfterResponseHook[] = []

  constructor(defaultOptions: FetchOptions) {
    this.defaultOptions = {
      retries: 0,
      retryDelay: 0,
      timeout: 10000,
      ...defaultOptions,
      headers: {
        'Content-Type': 'application/json',
        ...defaultOptions?.headers
      }
    }
  }

  async get<T = any, TParams = FetchParams>(
    url: string,
    options: FetchOptions<TParams> = {}
  ): Promise<FetchResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'GET'
    })
  }

  async post<T = any, TBody = any>(
    url: string,
    data?: TBody,
    options: FetchOptions = {}
  ): Promise<FetchResponse<T>> {
    const { body, headers } = this.prepareBody(data, options.headers)

    return this.makeRequest<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        ...headers
      },
      method: 'POST',
      body
    })
  }

  async put<T = any, TBody = any>(
    url: string,
    data?: TBody,
    options: FetchOptions = {}
  ): Promise<FetchResponse<T>> {
    const { body, headers } = this.prepareBody(data, options.headers)

    return this.makeRequest<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        ...headers
      },
      method: 'PUT',
      body
    })
  }

  async patch<T = any, TBody = any>(
    url: string,
    data?: TBody,
    options: FetchOptions = {}
  ): Promise<FetchResponse<T>> {
    const { body, headers } = this.prepareBody(data, options.headers)

    return this.makeRequest<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        ...headers
      },
      method: 'PATCH',
      body
    })
  }

  async delete<T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<FetchResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'DELETE'
    })
  }

  async make<T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<FetchResponse<T>> {
    return this.makeRequest<T>(url, options)
  }

  setHeader(key: string, value: string): void {
    if (!this.defaultOptions.headers) {
      this.defaultOptions.headers = {}
    }

    if (this.defaultOptions.headers instanceof Headers) {
      this.defaultOptions.headers.set(key, value)
    } else if (Array.isArray(this.defaultOptions.headers)) {
      this.defaultOptions.headers.push([key, value])
    } else {
      ;(this.defaultOptions.headers as Record<string, string>)[key] = value
    }
  }

  removeHeader(key: string): void {
    if (!this.defaultOptions.headers) return

    if (this.defaultOptions.headers instanceof Headers) {
      this.defaultOptions.headers.delete(key)
    } else if (Array.isArray(this.defaultOptions.headers)) {
      this.defaultOptions.headers = this.defaultOptions.headers.filter(
        ([headerKey]) => headerKey !== key
      )
    } else {
      delete (this.defaultOptions.headers as Record<string, string>)[key]
    }
  }

  onBeforeRequest(hook: BeforeRequestHook): void {
    this.beforeRequestHooks.push(hook)
  }

  offBeforeRequest(hook: BeforeRequestHook): void {
    const index = this.beforeRequestHooks.indexOf(hook)

    if (index > -1) {
      this.beforeRequestHooks.splice(index, 1)
    }
  }

  onAfterResponse(hook: AfterResponseHook): void {
    this.afterResponseHooks.push(hook)
  }

  offAfterResponse(hook: AfterResponseHook): void {
    const index = this.afterResponseHooks.indexOf(hook)

    if (index > -1) {
      this.afterResponseHooks.splice(index, 1)
    }
  }

  onResponseError(hook: ErrorHook): void {
    this.responseErrorHooks.push(hook)
  }

  offError(hook: ErrorHook): void {
    const index = this.responseErrorHooks.indexOf(hook)

    if (index > -1) {
      this.responseErrorHooks.splice(index, 1)
    }
  }

  clearHooks(): void {
    this.beforeRequestHooks = []
    this.responseErrorHooks = []
    this.afterResponseHooks = []
  }

  private prepareBody(
    data: any,
    headers: HeadersInit = {}
  ): { body: BodyInit | undefined; headers: HeadersInit } {
    if (!data) {
      return { body: undefined, headers }
    }

    if (data instanceof FormData) {
      return { body: data, headers }
    } else if (typeof data === 'object') {
      return {
        body: JSON.stringify(data),
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      }
    } else {
      return {
        body: String(data),
        headers: {
          ...headers,
          'Content-Type': 'text/plain'
        }
      }
    }
  }

  private async executeBeforeRequestHooks(
    url: string,
    options: FetchOptions
  ): Promise<void> {
    for (const hook of this.beforeRequestHooks) {
      await hook(url, options)
    }
  }

  private async executeAfterResponseHooks(
    response: FetchResponse<any>,
    url: string,
    options: FetchOptions
  ): Promise<void> {
    for (const hook of this.afterResponseHooks) {
      await hook(response, url, options)
    }
  }

  private async executeResponseErrorHooks(
    error: FetchError,
    url: string,
    options: FetchOptions
  ): Promise<boolean> {
    for (const hook of this.responseErrorHooks) {
      const result = await hook(error, url, options)

      if (result === true) {
        return true
      }
    }

    return false
  }

  private getCacheKey(url: string, options: RequestInit): string[] {
    const bodyHash = options.body
      ? this.hashString(JSON.stringify(options.body))
      : null

    return [
      'FetchClient',
      options.method || 'GET',
      url,
      ...(bodyHash ? [bodyHash] : [])
    ].filter((v): v is string => !!v)
  }

  private hashString(str: string): string {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)

      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    return hash.toString(36)
  }

  private async makeRequest<T>(
    url: string,
    options: FetchOptions<any> = {}
  ): Promise<FetchResponse<T>> {
    const { params, ...rest } = options

    const query = params
      ? '?' +
        Object.entries(params)
          .filter(
            ([, v]) =>
              v !== undefined &&
              v !== null &&
              !(typeof v === 'string' && v.trim() === '')
          )
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
          )
          .join('&')
      : ''

    const mergedOptions: FetchOptions & { next: { revalidate: number } } = {
      ...this.defaultOptions,
      ...rest,
      headers: {
        ...this.defaultOptions.headers,
        ...rest.headers
      },
      next: {
        revalidate: 0
      }
    }

    const fullUrl = mergedOptions.baseURL
      ? `${mergedOptions.baseURL}${url}${query}`
      : `${url}${query}`

    if (mergedOptions.body instanceof FormData) {
      if (mergedOptions.headers && 'Content-Type' in mergedOptions.headers) {
        delete mergedOptions.headers['Content-Type']
      }
    }

    const {
      timeout,
      retries = 0,
      retryDelay = 1000,
      cache,
      ...fetchOptions
    } = mergedOptions

    const pureFetch = async (): Promise<FetchResponse<T>> => {
      const fetchWithTimeout = (): Promise<Response> => {
        if (!timeout) return fetch(fullUrl, fetchOptions)

        return Promise.race([
          fetch(fullUrl, fetchOptions),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ])
      }

      const response = await fetchWithTimeout()

      if (!response.ok) {
        const error: FetchError = new Error(
          `FetchClientError! status: ${response.status}`
        ) as FetchError

        const rawBody = await response.text()

        try {
          const data = JSON.parse(rawBody)

          error.error = data.error
          error.status = data.statusCode
          error.message = data.message
        } catch {
          error.message = rawBody
          error.status = response.status
        }

        throw error
      }

      let data: T
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as T
      } else if (contentType?.includes('form-data')) {
        data = (await response.formData()) as T
      } else {
        data = (await response.blob()) as T
      }

      return {
        data,
        status: response.status,
        headers: response.headers
      }
    }

    const getCachedOrDirectFetch = async () => {
      if (typeof window === 'undefined' && cache) {
        const { revalidate, tags, keys = [] } = cache
        const cacheKey = this.getCacheKey(fullUrl, fetchOptions)

        const cachedFetch = unstable_cache(pureFetch, [...cacheKey, ...keys], {
          revalidate,
          tags
        })

        return cachedFetch()
      }

      return pureFetch()
    }

    const fetchWithHooks = async (): Promise<FetchResponse<T>> => {
      let lastError: FetchError = new Error('Unknown fetch error') as FetchError

      for (let attempt = 0; ; attempt++) {
        try {
          await this.executeBeforeRequestHooks(fullUrl, fetchOptions)

          const result = await getCachedOrDirectFetch()

          await this.executeAfterResponseHooks(result, fullUrl, fetchOptions)

          return result
        } catch (error: any) {
          const newError: FetchError =
            error instanceof Error
              ? error
              : Object.assign(new Error('Non-error thrown'), error)

          lastError = Object.assign(newError, lastError)

          const shouldRetry = await this.executeResponseErrorHooks(
            lastError,
            fullUrl,
            fetchOptions
          )

          if (attempt < retries || shouldRetry) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * (attempt + 1))
            )

            continue
          }

          break
        }
      }

      throw lastError
    }

    return fetchWithHooks()
  }
}
