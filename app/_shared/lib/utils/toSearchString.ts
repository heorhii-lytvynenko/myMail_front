export const toSearchString = (
  params: Record<string, any> | undefined
): string => {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key]

    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        searchParams.set(key, value.toISOString())
      } else if (Array.isArray(value)) {
        searchParams.set(key, value.join(','))
      } else {
        searchParams.set(key, String(value))
      }
    }
  }

  return searchParams.toString()
}
