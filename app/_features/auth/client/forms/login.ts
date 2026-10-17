import z from 'zod'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@shared/lib/const'
import { useSkipGuards, useZodForm } from '@shared/lib/hooks'
import { validators } from '@shared/lib/schemas'
import { errorHandler } from '@shared/lib/utils/error'
import { setAccessToken } from '@shared/lib/utils/token'
import { accountApi } from '@entities/account'
import { useAccountStore } from '@entities/client'
import { authApi } from '@entities/auth'
import { onboardingApi, resolveAuthRoute } from '@entities/onboarding'
import { useOnboardingStore } from '@entities/onboarding/client'

const schema = z.object({
  email: validators.email(),
  password: z.string().trim().min(1, 'validation.passwordRequired')
})

export const useLoginForm = () => {
  const router = useRouter()
  const setAccount = useAccountStore((state) => state.setAccount)
  const setOnboardingState = useOnboardingStore(
    (state) => state.setOnboardingState
  )
  const { setQuardsToSkip } = useSkipGuards()
  const form = useZodForm(schema, {
    onSubmit: async (values) => {
      const {
        data: { accessToken }
      } = await authApi.login(values)

      const [{ data: account }, { data: onboardingState }] = await Promise.all([
        accountApi.getAccount({
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        onboardingApi.getState({
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ])

      setQuardsToSkip(['guest'])

      setAccount(account)
      setOnboardingState(onboardingState)
      setAccessToken(accessToken)

      const route = resolveAuthRoute({
        hasAccount: true,
        href: ROUTES.profile,
        onboardingState
      })

      router.push(route)
    },
    onError: errorHandler
  })

  return form
}
