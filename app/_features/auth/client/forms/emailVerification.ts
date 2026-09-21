import z from 'zod'
import { useRouter } from 'next/navigation'
import { DYNAMIC_ROUTES } from '@shared/lib/const'
import { useZodForm } from '@shared/lib/hooks'
import { validators } from '@shared/lib/schemas'
import { errorHandler } from '@shared/lib/utils/error'
import { authApi } from '@entities/auth'

const resetSchema = z.object({
  email: validators.email()
})

export const useResendEmailVerificationForm = () => {
  const router = useRouter()

  const form = useZodForm(resetSchema, {
    onSubmit: async ({ email }) => {
      await authApi.resendEmailVerification(email)

      router.push(DYNAMIC_ROUTES.verifyEmail(email))
    },
    onError: errorHandler
  })

  return form
}
