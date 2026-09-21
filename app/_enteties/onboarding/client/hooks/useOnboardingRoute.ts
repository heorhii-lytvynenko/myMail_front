'use client'
import { resolveOnboardingRoute } from '../../lib/resolveOnboardingRoute'
import { useOnboardingStore } from '../providers'

export const useOnboardingRoute = () => {
  const onboardingState = useOnboardingStore((state) => state.onboardingState)

  return resolveOnboardingRoute(onboardingState)
}
