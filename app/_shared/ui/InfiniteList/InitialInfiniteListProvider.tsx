'use client'
import type { InfiniteData } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { PaginatedResponse } from '@shared/types'

type ContextType<
  TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>
> = InfiniteData<TData, number> | undefined

const Context = createContext<ContextType>(undefined)

export const useInitialInfiniteList = <
  TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>
>() => {
  const initialData = useContext(Context)

  if (!initialData) {
    throw new Error(
      'useInitialInfiniteList must be used within a InitialInfiniteListProvider'
    )
  }

  return initialData as InfiniteData<TData, number>
}

interface Props<TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>> {
  initialData: InfiniteData<TData, number>
  children?: ReactNode
}

export const InitialInfiniteListProvider = <
  TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>
>({
  children,
  initialData
}: Props<TData>) => {
  return <Context.Provider value={initialData}>{children}</Context.Provider>
}
