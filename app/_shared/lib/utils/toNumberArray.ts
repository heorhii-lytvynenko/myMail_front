export const toNumberArray = (
  value: string | string[] | null | undefined
): number[] | undefined => {
  if (!value) return undefined

  const arr = Array.isArray(value) ? value : [value]

  const nums = arr.map((v) => Number(v)).filter((n) => !Number.isNaN(n))

  return nums.length ? nums : undefined
}
