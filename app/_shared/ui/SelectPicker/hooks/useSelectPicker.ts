import { useEffect, useState } from 'react'
import { EMPTY_ARRAY } from '@shared/lib/const'
import type { SelectOptionType, SelectValueType } from '../types'

const getInitialValue = (value: any, fixedValue: any) => {
  const array = (Array.isArray(value) ? value : [value]).filter((v) => !!v)

  const first = array[0]

  if (first === undefined || first === null) {
    return fixedValue
  }

  return value
}

const getEmptyValue = (multiple: boolean | undefined, fixedValue: any) => {
  const fallback = multiple ? EMPTY_ARRAY : null

  return fixedValue ?? fallback
}

export const useSelectPicker = <
  TValue extends SelectOptionType,
  TMultiple extends boolean
>(
  selectValue: SelectValueType<TValue, TMultiple>,
  multiple: TMultiple | undefined,
  fixedValue: SelectValueType<TValue, TMultiple> | undefined
) => {
  const initialValue: SelectValueType<TValue, TMultiple> = getInitialValue(
    selectValue,
    fixedValue
  )

  const emptyValue: SelectValueType<TValue, TMultiple> = getEmptyValue(
    multiple,
    fixedValue
  )

  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return {
    isOpen,
    emptyValue,
    setIsOpen,
    value,
    setValue,
    initialValue
  }
}
