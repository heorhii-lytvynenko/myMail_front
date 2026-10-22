import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

interface ServerFetchBoundaryProps<T> {
  fetcher: () => Promise<T>
  render: (response: T) => ReactNode
}

export const ServerFetchBoundary = async <T,>({
  fetcher,
  render
}: ServerFetchBoundaryProps<T>) => {
  try {
    const response = await fetcher()

    return render(response)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      notFound()
    }

    throw error
  }
}
