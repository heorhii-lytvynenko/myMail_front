import { useCallback } from 'react'
import { useSessionExpiry } from 'app/_features/auth/useSessionExpiry'
import { useAccountStore } from 'app/(app)/_providers/AccountProvider'

export const AccountSync = () => {
  const setAccount = useAccountStore(state => state.setAccount)
  const clear = useCallback(() => setAccount(null), [setAccount])
  useSessionExpiry(clear)
  return null
}
