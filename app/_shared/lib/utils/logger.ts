import { IS_DEV } from '../const'

const defaultLogger = <T = unknown>(message: T, ...optionalParams: unknown[]): void => {
  if (!IS_DEV) return

  console.log(`[LOG ${new Date().toISOString()}]`, message, ...optionalParams)
}

export const logger = Object.assign(defaultLogger, {
  info<T = unknown>(message: T, ...optionalParams: unknown[]) {
    if (!IS_DEV) return

    console.info(
      `[INFO ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  },

  warn<T = unknown>(message: T, ...optionalParams: unknown[]) {
    if (!IS_DEV) return

    console.warn(
      `[WARN ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  },

  error<T = unknown>(message: T, ...optionalParams: unknown[]) {
    if (!IS_DEV) return

    console.error(
      `[ERROR ${new Date().toISOString()}]`,
      message,
      ...optionalParams
    )
  }
})
