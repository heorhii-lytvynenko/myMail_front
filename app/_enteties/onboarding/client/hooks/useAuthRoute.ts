'use client'
import { useAccountStore } from '@entities/client'
import { resolveAuthRoute } from '../../lib'
import { useOnboardingStore } from '../providers'

export const useAuthRoute = () => {
  const hasAccount = useAccountStore((state) => !!state.account)
  const onboardingState = useOnboardingStore((state) => state.onboardingState)

  return {
    resolve: (href: string) => {
      return resolveAuthRoute({ href, hasAccount, onboardingState })
    }
  }
}
