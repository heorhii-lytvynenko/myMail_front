'use client'
import { toast } from 'sonner'

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object' || !('message' in error)) return 'Unknown error'
  if (typeof error.message === 'string') return error.message
  if (Array.isArray(error.message)) return error.message.filter(value => typeof value === 'string').join(', ') || 'Unknown error'
  return 'Unknown error'
}
export const errorHandler = (error: unknown) => toast.error(getErrorMessage(error))
