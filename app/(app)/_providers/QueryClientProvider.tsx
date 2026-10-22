'use client'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchInterval: false,
            refetchIntervalInBackground: false
          }
        },
        queryCache: new QueryCache({
          onError: (error) => {
            toast.error(error.message)
          }
        })
      })
  )

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  )
}
