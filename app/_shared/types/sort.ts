import type { SelectOptionType } from '@shared/ui/SelectPicker'

export type SortType<T> = `${Extract<keyof T, string>},${'asc' | 'desc'}`

export type SortOptionType<T> = Omit<SelectOptionType, 'id'> & {
  id: SortType<T>
}
