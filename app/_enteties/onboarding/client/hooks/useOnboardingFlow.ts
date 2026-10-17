import { useRouter } from 'next/navigation'
import { useSkipGuards } from '@shared/lib/hooks'
import { resolveOnboardingRoute } from '@entities/onboarding/lib'
import type { OnboardingStateType } from '@entities/onboarding/types'
import { useOnboardingStore } from '../providers'

export const useOnboardingFlow = () => {
  const router = useRouter()
  const { setQuardsToSkip } = useSkipGuards()
  const setOnboardingState = useOnboardingStore(
    (state) => state.setOnboardingState
  )

  const next = (nextState: OnboardingStateType) => {
    const nextRoute = resolveOnboardingRoute(nextState)

    if (!nextRoute) return

    setQuardsToSkip(['onboarding-route'])
    setOnboardingState(nextState)
    router.replace(nextRoute)
  }

  const done = ({ redirectTo }: { redirectTo: string }) => {
    setQuardsToSkip(['onboarding-completed', 'onboarding-route'])

    setOnboardingState({
      step: 'DONE',
      isComplete: true
    })

    router.replace(redirectTo)
  }

  return {
    next,
    done
  }
}
