'use client'
import type { ComponentProps } from 'react'
import { createConextStore } from '@shared/lib/store'
import type { OnboardingStateType } from '../../types'
import { OnboardingSync } from '../ui/OnboardingSync'

interface OnboardingStore {
  onboardingState: OnboardingStateType | null
  setOnboardingState: (state: OnboardingStateType | null) => void
}

interface InitialStore {
  onboardingState: OnboardingStateType | null
}

const [OnboardingStoreProvider, useOnboardingStore] = createConextStore<
  OnboardingStore,
  InitialStore
>(({ onboardingState }, set) => ({
  onboardingState,
  setOnboardingState: (onboardingState) => set({ onboardingState })
}))

const OnboardingProvider = ({
  children,
  ...rest
}: ComponentProps<typeof OnboardingStoreProvider>) => {
  return (
    <OnboardingStoreProvider {...rest}>
      {children}

      <OnboardingSync />
    </OnboardingStoreProvider>
  )
}

export { OnboardingProvider, useOnboardingStore }
