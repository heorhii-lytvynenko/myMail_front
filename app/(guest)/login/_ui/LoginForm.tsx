'use client'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@shared/lib/const'
import { Input } from '@shared/ui/Input'
import { PasswordInput } from '@shared/ui/PasswordInput'
import { useLoginForm } from '@features/auth/client'
import { Switch } from '@shared/ui/Switch'
import { FlowCard } from '@shared/ui/FlowCard'
import { Button } from '@shared/ui/Button'


export const LoginForm = () => {
  const t = useTranslations()
  const {
    register,
    handleSubmit,
    isSubmitting,
    formState: { errors }
  } = useLoginForm()

  return (
    <form
      className={`
        flex flex-col gap-4
        md:gap-6
      `}
      onSubmit={handleSubmit}
    >
      <Input
        size='l'
        label={t('auth.email')}
        placeholder={t('auth.emailPlaceholder')}
        error={errors.email?.message}
        autoComplete='username'
        translateError
        {...register('email')}
      />

      <PasswordInput
        size='l'
        label={t('auth.password')}
        placeholder={t('auth.passwordPlaceholder')}
        error={errors.password?.message}
        autoComplete='current-password'
        translateError
        {...register('password')}
      />

      <div className='flex items-center justify-between gap-2'>
        <Switch name='remember' label={t('auth.rememberMe')} />

        <FlowCard.Link href={ROUTES.resetPassword}>
          {t('auth.forgotPassword')}
        </FlowCard.Link>
      </div>

      <Button size='xl' type='submit' loading={isSubmitting}>
        {t('auth.signIn')}
      </Button>
    </form>
  )
}
