import z from 'zod'
import { parseQueryDate } from './utils/parseQueryDate'

export const QueryString = z.string().trim().nullish()

export const QueryNumber = z
  .string()
  .transform((v) => {
    const n = Number(v)

    return isNaN(n) ? undefined : n
  })
  .nullish()

export const PaginationSchema = z.object({
  page: QueryNumber,
  pageSize: QueryNumber
})

export const PaganationSchema = PaginationSchema

export type PaginationType = z.infer<typeof PaginationSchema>

export const QueryBoolean = z
  .string()
  .transform((v) => {
    const lower = v.toLowerCase()

    if (lower === 'true') return true
    if (lower === 'false') return false

    return undefined
  })
  .nullish()

export const QueryArray = z
  .string()
  .transform((v) => v.split(',').map((v) => v.trim()))
  .nullish()

export const QueryNumberArray = z
  .string()
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n))
  )
  .transform((arr) => (arr.length > 0 ? arr : undefined))
  .nullish()

export const QueryEnum = <T extends readonly (string | number)[]>(
  values: T,
  defaultValue?: T[number]
) => {
  return z
    .string()
    .transform((v) => v.trim())
    .transform((v) =>
      values.map(String).includes(v) ? (v as T[number]) : undefined
    )
    .default(defaultValue as any)
    .nullish()
}

export const QueryEnumArray = <T extends readonly (string | number)[]>(
  values: T
) =>
  z
    .string()
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter((s): s is Extract<T[number], string> =>
          values.map(String).includes(s)
        )
    )
    .transform((arr) => (arr.length > 0 ? arr : undefined))
    .nullish()

export const QueryDateFrom = z
  .string()
  .trim()
  .transform((v) => parseQueryDate(v, { type: 'from' }))
  .nullish()

export const QueryDateTo = z
  .string()
  .trim()
  .transform((v) => parseQueryDate(v, { type: 'to' }))
  .nullish()
