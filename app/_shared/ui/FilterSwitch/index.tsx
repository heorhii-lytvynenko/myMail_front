'use client'
import { useFilterInput } from '@shared/lib/hooks'
import type { SwitchProps } from '../Switch'
import { Switch } from '../Switch'

export interface FilterSwitchProps extends Omit<SwitchProps, 'checked'> {
  debounceDelay?: number
}

export const FilterSwitch = ({
  name,
  onCheckedChange,
  debounceDelay = 300,
  ...restProps
}: FilterSwitchProps) => {
  const { value, setValue } = useFilterInput({
    name,
    debounceDelay,
    updateParamForTouch: true
  })
  const isChecked = value === 'true'

  return (
    <Switch
      name={name}
      checked={isChecked}
      onCheckedChange={(checked) => {
        setValue(isChecked ? '' : 'true')
        onCheckedChange?.(checked)
      }}
      {...restProps}
    />
  )
}
