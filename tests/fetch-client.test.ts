import { afterEach, beforeEach, expect, it, vi } from 'vitest'
vi.mock('next/cache', () => ({ unstable_cache: vi.fn() }))
import { FetchClient } from '../app/_shared/lib/utils/fetch'

const fetchMock = vi.fn<typeof fetch>()
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock) })
afterEach(() => vi.unstubAllGlobals())

it('keeps the actual HTTP status when the backend uses status instead of statusCode', async () => {
  fetchMock.mockResolvedValue(Response.json({ status: 401, message: 'untrusted details' }, { status: 401 }))
  await expect(new FetchClient({}).get('/me')).rejects.toMatchObject({ status: 401, message: 'Request failed (401).' })
})
it('refreshes hook-managed headers and bounds hook retries', async () => {
  let token = 'old'
  const client = new FetchClient({})
  client.onBeforeRequest((_url, options) => { options.headers = { Authorization: token, ...options.headers } })
  client.onResponseError(() => { token = 'new'; return true })
  fetchMock.mockResolvedValue(Response.json({}, { status: 401 }))
  await expect(client.get('/me')).rejects.toMatchObject({ status: 401 })
  expect(fetchMock).toHaveBeenCalledTimes(2)
  expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get('authorization')).toBe('new')
})
it('refuses shared caching for authenticated requests before issuing a request', async () => {
  const client = new FetchClient({ credentials: 'omit', headers: { Authorization: 'private' } })
  await expect(client.get('/me', { cache: { revalidate: 60, tags: [] } })).rejects.toThrow('anonymous GET')
  expect(fetchMock).not.toHaveBeenCalled()
})
it('does not retry mutations or retry authentication errors automatically', async () => {
  fetchMock.mockResolvedValue(Response.json({}, { status: 500 }))
  await expect(new FetchClient({ retries: 3 }).post('/register', {})).rejects.toMatchObject({ status: 500 })
  expect(fetchMock).toHaveBeenCalledTimes(1)
})
it('uses an abort signal to stop a timed out request', async () => {
  fetchMock.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
    options?.signal?.addEventListener('abort', () => reject(options.signal?.reason))
  }))
  await expect(new FetchClient({ timeout: 10 }).get('/slow')).rejects.toMatchObject({ name: 'TimeoutError' })
  expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true)
})
