import z from 'zod'
import { useRouter } from 'next/navigation'
import { DYNAMIC_ROUTES } from '@shared/lib/const'
import { useZodForm } from '@shared/lib/hooks'
import { validators } from '@shared/lib/schemas'
import { errorHandler } from '@shared/lib/utils/error'
import { authApi } from '@entities/auth'

const schema = z
  .object({
    displayName: validators.fullName(),
    email: validators.email(),
    password: validators.password(),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordNotMatch',
    path: ['confirmPassword']
  })

export const useRegisterForm = () => {
  const router = useRouter()
  const form = useZodForm(schema, {
    onSubmit: async (values) => {
      await authApi.register(values)

      router.push(DYNAMIC_ROUTES.verifyEmail(values.email))
    },
    onError: errorHandler
  })

  return form
}
