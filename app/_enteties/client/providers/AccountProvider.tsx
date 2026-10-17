'use client'
import type { ComponentProps } from 'react'
import { createConextStore } from '@shared/lib/store'
import type { AccountType } from '@entities/account'
import { AccountSync } from '../ui/AccountSync'

interface AccountStore {
  account: AccountType | null
  setAccount: (account: AccountType | null) => void
}

interface InitialStore {
  account: AccountType | null
}

const [AccountStoreProvider, useAccountStore] = createConextStore<
  AccountStore,
  InitialStore
>(({ account }, set) => ({
  account,
  setAccount: (account) => set({ account })
}))

const AccountProvider = ({
  children,
  ...rest
}: ComponentProps<typeof AccountStoreProvider>) => {
  return (
    <AccountStoreProvider {...rest}>
      {children}

      <AccountSync />
    </AccountStoreProvider>
  )
}

const useAccount = () => {
  return useAccountStore((state) => state.account!)
}

export { AccountProvider, useAccountStore, useAccount }
