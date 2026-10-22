// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { AuthForm } from '../app/_features/auth/AuthForm'
import { ConnectGoogleButton } from '../app/_features/google-integration/ui/ConnectGoogleButton'
import { LogoutButton } from '../app/_features/auth/LogoutButton'
import { GMAIL_SCOPE } from '../app/_features/google-integration/contracts'
import { AccountDashboard } from '../app/_features/dashboard/AccountDashboard'
import { renderWithIntl as render } from './render'

const navigation = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => navigation }))
const fetchMock = vi.fn<typeof fetch>()
beforeEach(() => { vi.stubGlobal('fetch', fetchMock); fetchMock.mockReset(); navigation.replace.mockReset(); navigation.refresh.mockReset() })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('announces field-specific registration errors and focuses the first invalid input', async () => {
  render(<AuthForm mode="register" />)
  fireEvent.submit(screen.getByRole('button', { name: 'Create account' }).closest('form')!)
  expect(await screen.findByText('Enter a valid email address.')).toBeVisible()
  expect(screen.getByLabelText('Email')).toHaveFocus()
  expect(screen.getByLabelText('Password', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  expect(fetchMock).not.toHaveBeenCalled()
})
it('preserves locale and prevents simultaneous login submissions', async () => {
  let finish!: (value: Response) => void
  fetchMock.mockReturnValue(new Promise(resolve => { finish = resolve }))
  render(<AuthForm mode="login" locale="pl" />, 'pl')
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'review@example.com' } })
  fireEvent.change(screen.getByLabelText('Hasło'), { target: { value: ' password ' } })
  const form = screen.getByRole('button', { name: 'Zaloguj się' }).closest('form')!
  fireEvent.submit(form); fireEvent.submit(form)
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('button', { name: 'Proszę czekać…' })).toBeDisabled()
  finish(Response.json({ ok: true }))
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/pl/account'))
  expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string).password).toBe(' password ')
})
it('recovers submission state and announces invalid credentials', async () => {
  fetchMock.mockResolvedValue(Response.json({ code: 'INVALID_CREDENTIALS' }, { status: 401 }))
  const user = userEvent.setup()
  render(<AuthForm mode="login" />)
  await user.type(screen.getByLabelText('Email'), 'review@example.com')
  await user.type(screen.getByLabelText('Password'), 'wrong-password')
  await user.click(screen.getByRole('button', { name: 'Log in' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
  expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled()
})
it('does not expose an arbitrary error body when the service is unavailable', async () => {
  fetchMock.mockResolvedValue(new Response('upstream internal secret', { status: 502 }))
  render(<AuthForm mode="login" />)
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'review@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Log in' }).closest('form')!)
  expect(await screen.findByRole('alert')).toHaveTextContent('temporarily unavailable')
  expect(screen.queryByText('upstream internal secret')).toBeNull()
})
it('keeps Gmail disabled without making backend requests', () => {
  render(<ConnectGoogleButton enabled={false} />)
  expect(screen.getByText('Gmail connection is not available yet.')).toBeVisible()
  expect(fetchMock).not.toHaveBeenCalled()
})
it('uses backend status rather than a success query parameter to claim a connection', async () => {
  fetchMock.mockResolvedValue(Response.json({ status: 'disconnected' }))
  render(<ConnectGoogleButton enabled result="connected" />)
  expect(await screen.findByText('No Gmail account is connected.')).toBeVisible()
  expect(screen.queryByText('Gmail is connected.')).toBeNull()
})
it('shows a cancellation outcome and actual connection status', async () => {
  fetchMock.mockResolvedValue(Response.json({ status: 'disconnected' }))
  render(<ConnectGoogleButton enabled result="cancelled" />)
  expect(screen.getByText(/Google connection was cancelled/)).toHaveAttribute('role', 'status')
  expect(await screen.findByRole('button', { name: 'Connect Google' })).toBeEnabled()
})
it('shows reconnect and disconnect actions for revoked Gmail permissions', async () => {
  fetchMock.mockResolvedValue(Response.json({ status: 'reconnect_required', email: 'gmail@example.com', scopes: [] }))
  render(<ConnectGoogleButton enabled />)
  expect(await screen.findByRole('button', { name: 'Reconnect Google' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Disconnect Gmail' })).toBeEnabled()
})
it('updates the connection only after successful disconnection', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ status: 'connected', email: 'gmail@example.com', scopes: [GMAIL_SCOPE] }))
  fetchMock.mockResolvedValueOnce(Response.json({ ok: true }))
  render(<ConnectGoogleButton enabled />)
  const button = await screen.findByRole('button', { name: 'Disconnect Gmail' })
  await userEvent.setup().click(button)
  expect(await screen.findByText('Gmail has been disconnected.')).toBeVisible()
  expect(screen.getByText('No Gmail account is connected.')).toBeVisible()
})
it('logs out through the same-origin endpoint and preserves locale', async () => {
  fetchMock.mockResolvedValue(Response.json({ ok: true }))
  render(<LogoutButton locale="pl" />, 'pl')
  await userEvent.setup().click(screen.getByRole('button', { name: 'Wyloguj się' }))
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/pl/login'))
  expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/logout')
})

it('shows the signed-in account and a disabled Google action while integration is unavailable', () => {
  render(<AccountDashboard email="review@example.com" googleEnabled={false} />)
  expect(screen.getByRole('heading', { name: 'Your dashboard' })).toBeVisible()
  expect(screen.getByText('review@example.com')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Connect Google' })).toBeDisabled()
  expect(fetchMock).not.toHaveBeenCalled()
})

it('localizes the dashboard and preserves account navigation', async () => {
  fetchMock.mockResolvedValue(Response.json({ status: 'disconnected' }))
  render(<AccountDashboard email="review@example.com" locale="pl" googleEnabled />, 'pl')
  expect(screen.getByRole('heading', { name: 'Twój pulpit' })).toBeVisible()
  expect(screen.getByRole('link', { name: 'Pulpit' })).toHaveAttribute('href', '/pl/account')
  expect(await screen.findByRole('button', { name: 'Połącz Google' })).toBeEnabled()
})

it('retries a failed connection status check and restores the connect action', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ code: 'SERVICE_UNAVAILABLE' }, { status: 503 }))
  fetchMock.mockResolvedValueOnce(Response.json({ status: 'disconnected' }))
  render(<ConnectGoogleButton enabled />)
  expect(await screen.findByRole('alert')).toHaveTextContent('We could not check your Gmail connection.')
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByRole('button', { name: 'Connect Google' })).toBeEnabled()
  expect(screen.queryByRole('alert')).toBeNull()
})

it('rejects an unexpected authorization destination and restores the connect button', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ status: 'disconnected' }))
  fetchMock.mockResolvedValueOnce(Response.json({ url: 'https://attacker.example/authorize' }))
  render(<ConnectGoogleButton enabled />)
  await userEvent.setup().click(await screen.findByRole('button', { name: 'Connect Google' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('We could not check your Gmail connection.')
  expect(screen.getByRole('button', { name: 'Connect Google' })).toBeEnabled()
  expect(fetchMock.mock.calls[1][0]).toBe('/api/integrations/google/connect')
  expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'POST', credentials: 'same-origin' })
})

it('returns an expired Google session to the localized login page', async () => {
  fetchMock.mockResolvedValue(Response.json({ code: 'SESSION_EXPIRED' }, { status: 401 }))
  render(<ConnectGoogleButton locale="ua" enabled />, 'ua')
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/ua/login?reason=session-expired'))
})
