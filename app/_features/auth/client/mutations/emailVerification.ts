import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { errorHandler } from '@shared/lib/utils/error'
import { authApi } from '@entities/auth'

export const useResendEmailVerificationMutation = (email: string) => {
  const t = useTranslations()
  const { mutate: resendEmailVerification, ...rest } = useMutation({
    mutationFn: async () => authApi.resendEmailVerification(email),
    onSuccess: () => {
      toast.success(t('auth.emailVerificationResentSuccessfully'))
    },
    onError: errorHandler
  })

  return {
    resendEmailVerification,
    ...rest
  }
}
