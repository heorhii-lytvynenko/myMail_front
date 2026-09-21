import type { IconType } from '@shared/lib/const'

export type SelectVariantType = 'field' | 'text'
export type SelectSizeType = 'm' | 'l'
export type SelectOptionType = {
  id: string | number
  displayName?: string
  iconLeft?: IconType
}
export type SelectValueType<
  TValue extends SelectOptionType,
  TMultiple extends boolean
> = TMultiple extends true ? TValue[] : TValue | null
