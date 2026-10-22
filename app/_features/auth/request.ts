'use client'
import { z } from 'zod'

const failureSchema = z.object({
  code: z.string().optional(), fields: z.record(z.string(), z.string()).optional(),
})
export const okSchema = z.object({ ok: z.literal(true) })

export class RequestError extends Error {
  constructor(public readonly status: number, public readonly code: string, public readonly fields: Record<string, string> = {}) {
    super(code)
  }
}

export async function requestJson<T extends z.ZodType>(url: string, options: RequestInit, schema: T): Promise<z.infer<T>> {
  const timeout = AbortSignal.timeout(20000)
  const response = await fetch(url, {
    ...options, credentials: 'same-origin', cache: 'no-store', redirect: 'error',
    signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
  })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const parsed = failureSchema.safeParse(body)
    throw new RequestError(response.status, parsed.success ? parsed.data.code ?? 'SERVICE_UNAVAILABLE' : 'SERVICE_UNAVAILABLE', parsed.success ? parsed.data.fields : undefined)
  }
  return schema.parse(body)
}
