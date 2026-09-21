'use client'
import { toast } from 'sonner'
import { isType } from './isType'

const getErrorMessage = (error: any) => {
  const fallbackMessage = 'Unknown error'

  if (!Object.hasOwn(error, 'message')) {
    return fallbackMessage
  }

  const message = error.message

  if (isType.string(message)) {
    return message
  }

  if (isType.array(message)) {
    return message.join(', ')
  }

  return fallbackMessage
}

export const errorHandler = (error: any) => {
  const message = getErrorMessage(error)

  toast.error(message)
}
