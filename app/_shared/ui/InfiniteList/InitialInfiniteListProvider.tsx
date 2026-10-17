'use client'
import type { InfiniteData } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { PaginatedResponse } from '@shared/types'

type ContextType<
  TData extends PaginatedResponse<any> = PaginatedResponse<any>
> = InfiniteData<TData, number> | undefined

const Context = createContext<ContextType<any>>(undefined)

export const useInitialInfiniteList = <
  TData extends PaginatedResponse<any> = PaginatedResponse<any>
>() => {
  const initialData = useContext<ContextType<TData>>(Context)

  if (!initialData) {
    throw new Error(
      'useInitialInfiniteList must be used within a InitialInfiniteListProvider'
    )
  }

  return initialData
}

interface Props<TData extends PaginatedResponse<any> = PaginatedResponse<any>> {
  initialData: InfiniteData<TData, number>
  children?: ReactNode
}

export const InitialInfiniteListProvider = <
  TData extends PaginatedResponse<any> = PaginatedResponse<any>
>({
  children,
  initialData
}: Props<TData>) => {
  return <Context.Provider value={initialData}>{children}</Context.Provider>
}
