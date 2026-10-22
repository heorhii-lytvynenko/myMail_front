type TransformMap<T> = { [K in keyof T]?: (value: T[K], obj: T) => unknown }
type Transformed<T, TM> = { [K in keyof T]: K extends keyof TM ? ReturnType<Extract<NonNullable<TM[K]>, (...args: never[]) => unknown>> : T[K] }

export const transformObject = <T extends Record<string, unknown>, TM extends TransformMap<T>>(obj: T, transforms: TM): Transformed<T, TM> => {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    const transform = transforms[key] as ((value: T[typeof key], obj: T) => unknown) | undefined
    result[key] = transform ? transform(obj[key], obj) : obj[key]
  }
  return result as Transformed<T, TM>
}
