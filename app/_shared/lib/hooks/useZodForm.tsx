import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import type { Resolver, UseFormProps } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { ZodObject } from 'zod'
import type { z } from 'zod'

interface Options<T extends ZodObject<any>> extends Omit<
  UseFormProps<z.infer<T>>,
  'resolver'
> {
  onSubmit?: (data: z.infer<T>) => Promise<void> | void
  onError?: (error: unknown) => void
}

export const useZodForm = <T extends ZodObject<any>>(
  schema: T,
  options: Options<T>
) => {
  const { onSubmit, onError, ...restOptions } = options
  const [isSubmitting, startSubmitting] = useTransition()

  const { handleSubmit: handleSubmitForm, ...restForm } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema) as unknown as Resolver<
      z.infer<typeof schema>,
      any,
      z.infer<typeof schema>
    >,
    ...restOptions
  })

  const handleSubmit = handleSubmitForm((data) => {
    startSubmitting(async () => {
      try {
        await onSubmit?.(data)
      } catch (error) {
        onError?.(error)
      }
    })
  })

  return {
    ...restForm,
    handleSubmit,
    isSubmitting
  }
}
