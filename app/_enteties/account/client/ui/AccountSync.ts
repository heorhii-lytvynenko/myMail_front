
import { useAccountStore } from 'app/(app)/_providers/AccountProvider'
import { useCookies } from 'app/_shared/lib/hooks'
import { ACCESS_TOKEN_NAME } from 'app/_shared/lib/utils'
import { useEffect } from 'react'

export const AccountSync = () => {
  const setAccount = useAccountStore((state) => state.setAccount)
  const [{ access_token }] = useCookies([ACCESS_TOKEN_NAME])
  const hasAccessToken = !!access_token

  useEffect(() => {
    if (!hasAccessToken) {
      setAccount(null)

      return
    }
  }, [hasAccessToken])

  return null
}
