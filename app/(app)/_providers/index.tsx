import { NextIntlClientProvider } from 'next-intl'
import type { PropsWithChildren } from 'react'
import { Toaster } from '@shared/ui/Toaster'
import type { AccountType } from '@entities/account'
import { AccountProvider } from '@entities/client'
import type { OnboardingStateType } from '@entities/onboarding'
import { OnboardingProvider } from '@entities/onboarding/client'
import { CookiesProvider } from './CookiesProvider'
import { QueryClientProvider } from './QueryClientProvider'
import { RestorePreviousPageProvider } from './RestorePreviousPageProvider'

interface Props {
  account: AccountType | null
  onboardingState: OnboardingStateType | null
}

export const Providers = ({
  account,
  onboardingState,
  children
}: PropsWithChildren<Props>) => {
  return (
    <CookiesProvider>
      <NextIntlClientProvider>
        <QueryClientProvider>
          <AccountProvider account={account}>
            <OnboardingProvider onboardingState={onboardingState}>
              {children}

              <Toaster />
              <RestorePreviousPageProvider />
            </OnboardingProvider>
          </AccountProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </CookiesProvider>
  )
}
