type TransformMap<T> = {
  [K in keyof T]?: (value: T[K], obj: T) => any
}

export const transformObject = <
  T extends Record<string, any>,
  TM extends TransformMap<T>
>(
  obj: T,
  transforms: TM
): {
  [K in keyof T]: K extends keyof TM ? ReturnType<NonNullable<TM[K]>> : T[K]
} => {
  const result: any = {}

  for (const key in obj) {
    const transform = transforms[key as keyof TM]

    result[key] = transform ? transform(obj[key], obj) : obj[key]
  }

  return result
}
