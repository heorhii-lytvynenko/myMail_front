import type { SelectOptionType, SelectValueType } from '@shared/ui/SelectPicker'
import { isSameOption } from './helpers'

type ApplySelectionParams<
  TValue extends SelectOptionType,
  TMultiple extends boolean
> = {
  option: TValue
  multiple: boolean | undefined
  prev: SelectValueType<TValue, TMultiple>
  fixedValue?: TValue | TValue[] | null
}

export const getSelectNextValue = <
  TValue extends SelectOptionType,
  TMultiple extends boolean
>({
  option,
  multiple,
  prev,
  fixedValue
}: ApplySelectionParams<TValue, TMultiple>): SelectValueType<
  TValue,
  TMultiple
> => {
  if (multiple) {
    const current = prev ? (Array.isArray(prev) ? prev : [prev]) : []

    const fixed = fixedValue
      ? Array.isArray(fixedValue)
        ? fixedValue
        : [fixedValue]
      : []

    const exists = current.some((v) => isSameOption(v, option))

    if (exists) {
      return current.filter((v) => {
        const isFixed = fixed.some((f: any) => f.id === (v as any).id)

        return isFixed || !isSameOption(v, option)
      }) as SelectValueType<TValue, TMultiple>
    }

    return [...current, option] as SelectValueType<TValue, TMultiple>
  }

  const current = prev as TValue | null
  let nextValue: TValue | null = isSameOption(current, option) ? null : option

  if (fixedValue && !nextValue) {
    return current as SelectValueType<TValue, TMultiple>
  }

  return nextValue as SelectValueType<TValue, TMultiple>
}
