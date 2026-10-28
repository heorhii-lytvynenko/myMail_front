// @vitest-environment jsdom
import { createRef } from 'react'
import { afterEach, expect, it } from 'vitest'
import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { Input } from '../app/_shared/ui/Input'
import { renderWithIntl as render } from './render'

afterEach(cleanup)

it('keeps the label distinct from hints and errors and forwards native input props', async () => {
  const ref = createRef<HTMLInputElement>()
  render(<>
    <p id='external-help'>Use your account email.</p>
    <Input
      id='account-email'
      name='email'
      type='email'
      label='Email'
      required
      autoComplete='email'
      ref={ref}
      aria-describedby='external-help'
      helperText='We keep your address private.'
      error='Enter a valid email address.'
      slotProps={{ helperText: { id: 'email-help' }, error: { id: 'email-error' } }}
    />
  </>)
  const input = screen.getByLabelText('Email')
  expect(input).toBe(ref.current)
  expect(input).toBeRequired()
  expect(input).toHaveAttribute('name', 'email')
  expect(input).toHaveAttribute('autocomplete', 'email')
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription('Use your account email. We keep your address private. Enter a valid email address.')
  await userEvent.setup().click(screen.getByText('Email', { selector: 'label' }))
  expect(input).toHaveFocus()
})

it('associates unnamed controls with their own labels', () => {
  render(<><Input label='First input' /><Input label='Second input' /></>)
  const first = screen.getByLabelText('First input')
  const second = screen.getByLabelText('Second input')
  expect(first.id).not.toBe(second.id)
  expect(first).not.toHaveAttribute('aria-describedby')
  expect(first).toHaveAttribute('aria-invalid', 'false')
})
