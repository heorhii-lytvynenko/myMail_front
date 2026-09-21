import z from 'zod'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@shared/lib/const'
import { useZodForm } from '@shared/lib/hooks'
import { validators } from '@shared/lib/schemas'
import { errorHandler } from '@shared/lib/utils/error'
import { authApi } from '@entities/auth'

const resetSchema = z.object({
  email: validators.email()
})

export const useResetPasswordForm = () => {
  const router = useRouter()

  const form = useZodForm(resetSchema, {
    onSubmit: async (values) => {
      await authApi.resetPassword(values)

      router.push(ROUTES.resetPasswordCheckEmail)
    },
    onError: errorHandler
  })

  return form
}

const newPasswordSchema = z
  .object({
    newPassword: validators.password(),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordNotMatch'
  })

interface UseNewPasswordFormProps {
  token: string
}

export const useNewPasswordForm = ({ token }: UseNewPasswordFormProps) => {
  const router = useRouter()
  const form = useZodForm(newPasswordSchema, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    onSubmit: async ({ confirmPassword, ...values }) => {
      await authApi.newPassword({ ...values, token })
      router.replace(ROUTES.resetPasswordSuccess)
    },
    onError: (e: any) => {
      if (e.message.includes('expired')) {
        router.replace(ROUTES.resetPasswordExpired)

        return
      }

      errorHandler(e)
    }
  })

  return form
}
