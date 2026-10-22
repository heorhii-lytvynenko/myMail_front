import { useState } from 'react'
import { EMPTY_ARRAY } from '@shared/lib/const'
import type { SelectOptionType, SelectValueType } from '../types'

export const useSelectPicker = <TValue extends SelectOptionType, TMultiple extends boolean>(
  selectValue: SelectValueType<TValue, TMultiple>, multiple: TMultiple | undefined,
  fixedValue: SelectValueType<TValue, TMultiple> | undefined,
) => {
  const emptyValue = (fixedValue ?? (multiple ? EMPTY_ARRAY : null)) as SelectValueType<TValue, TMultiple>
  const populated = Array.isArray(selectValue) ? selectValue.length > 0 : selectValue != null
  const initialValue = populated ? selectValue : emptyValue
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [previousInitial, setPreviousInitial] = useState(initialValue)
  if (previousInitial !== initialValue) {
    setPreviousInitial(initialValue)
    setValue(initialValue)
  }
  return { isOpen, emptyValue, setIsOpen, value, setValue, initialValue }
}
