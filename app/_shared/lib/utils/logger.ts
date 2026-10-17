/* eslint-disable no-console */
import { IS_DEV } from '../const'

const defaultLogger = <T = any>(message: T, ...optionalParams: any[]): void => {
  if (!IS_DEV) return

  console.log(`[LOG ${new Date().toISOString()}]`, message, ...optionalParams)
}

export const logger = Object.assign(defaultLogger, {
  info<T = any>(message: T, ...optionalParams: any[]) {
    if (!IS_DEV) return

    console.info(
      `[INFO ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  },

  warn<T = any>(message: T, ...optionalParams: any[]) {
    if (!IS_DEV) return

    console.warn(
      `[WARN ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  },

  error<T = any>(message: T, ...optionalParams: any[]) {
    if (!IS_DEV) return

    console.error(
      `[ERROR ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  }
})
