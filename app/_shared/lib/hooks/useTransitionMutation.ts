/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DefaultError, UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useTransition } from 'react'

export const useTransitionMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TOnMutateResult = unknown
>({
  mutationFn,
  ...restOptions
}: Omit<
  UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
  'mutationFn'
> & {
  mutationFn: NonNullable<
    UseMutationOptions<TData, TError, TVariables, TOnMutateResult>['mutationFn']
  >
}) => {
  const [isPending, startTransition] = useTransition()
  const { isPending: _, ...rest } = useMutation({
    mutationFn: async (...args) => {
      return new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await mutationFn(...args)

            resolve(result)
          } catch (error) {
            reject(error)
          }
        })
      })
    },
    ...restOptions
  })

  return { ...rest, isPending }
}
