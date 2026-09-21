import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { ProxyHandler } from '../types'

const mergeResponseMeta = (
  source: NextResponse,
  target: NextResponse
): void => {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    if (!target.cookies.has(name)) {
      target.cookies.set(name, value, options)
    }
  })

  const SKIP_HEADERS = new Set([
    'content-type',
    'content-length',
    'transfer-encoding',
    'set-cookie'
  ])

  source.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key) && !target.headers.has(key)) {
      target.headers.set(key, value)
    }
  })
}

export const createProxyChain = (handlers: ProxyHandler[]) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const dispatch = async (
      index: number,
      request: NextRequest,
      response: NextResponse
    ): Promise<NextResponse> => {
      if (index >= handlers.length) return response

      const handler = handlers[index]

      const nextResponse = await handler(
        request,
        response,
        (nextRequest, nextResponse) =>
          dispatch(index + 1, nextRequest, nextResponse)
      )

      mergeResponseMeta(response, nextResponse)

      return nextResponse
    }

    return dispatch(0, request, NextResponse.next())
  }
}
