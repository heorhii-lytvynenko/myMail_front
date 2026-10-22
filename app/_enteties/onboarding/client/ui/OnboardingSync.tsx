import { useEffect } from 'react'
import { useAccountStore } from '@entities/client'
import { useOnboardingStore } from '../providers'

export const OnboardingSync = () => {
  const setOnboardingState = useOnboardingStore(
    (state) => state.setOnboardingState
  )
  const hasAccount = useAccountStore((state) => !!state.account)

  useEffect(() => {
    if (!hasAccount) {
      setOnboardingState(null)
    }
  }, [hasAccount, setOnboardingState])

  return null
}
