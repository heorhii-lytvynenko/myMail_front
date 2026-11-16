import { useTranslations } from 'next-intl'
import { Input, type InputProps } from '@shared/ui/Input'
import type { AuthFieldErrors, AuthMode } from '../lib/useAuthForm'

const fieldSlotProps: InputProps['slotProps'] = {
  root: { className: 'gap-2' },
  label: { className: 'text-sm font-semibold text-label' },
  helperText: { className: 'max-w-prose text-sm leading-relaxed font-normal text-muted' },
  error: { className: 'text-base font-normal text-danger' }
}

export function AuthFields({ mode, pending, errors }: {
  mode: AuthMode
  pending: boolean
  errors: AuthFieldErrors
}) {
  const t = useTranslations('auth')
  const signingUp = mode === 'register'
  const inputProps = {
    required: true,
    disabled: pending,
    className: 'h-auto rounded-lg px-3.5 py-3',
    slotProps: fieldSlotProps
  } satisfies Partial<InputProps>

  return <>
    <Input
      {...inputProps}
      name='email'
      type='email'
      label={t('email')}
      autoComplete='email'
      inputMode='email'
      maxLength={254}
      placeholder={t('emailPlaceholder')}
      error={errors.email}
    />
    <Input
      {...inputProps}
      name='password'
      type='password'
      label={t('password')}
      autoComplete={signingUp ? 'new-password' : 'current-password'}
      minLength={signingUp ? 8 : 1}
      maxLength={1024}
      placeholder={t('passwordPlaceholder')}
      helperText={signingUp ? t('passwordHint') : undefined}
      error={errors.password}
    />
    {signingUp && <Input
      {...inputProps}
      name='confirmPassword'
      type='password'
      label={t('confirmation')}
      autoComplete='new-password'
      maxLength={1024}
      error={errors.confirmPassword}
    />}
  </>
}
