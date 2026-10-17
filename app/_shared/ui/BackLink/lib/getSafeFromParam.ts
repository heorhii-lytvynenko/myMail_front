interface Options {
  param: string | null
  fallback: string
}

export const getSafeFromParam = ({ param, fallback }: Options): string => {
  if (!param) {
    return fallback
  }

  if (
    param.startsWith('/') &&
    !param.startsWith('//') &&
    !param.includes('://')
  ) {
    return param
  }

  return fallback
}
