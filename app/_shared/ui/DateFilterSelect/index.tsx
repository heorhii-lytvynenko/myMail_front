import { DATE_PERIODS } from '@shared/lib/const'
import type { FilterSelectProps } from '../FilterSelect'
import { FilterSelect } from '../FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof DATE_PERIODS)[number], TMultiple>,
  'options'
>

export const DateFilterSelect = <TMultiple extends boolean = false>({
  multiple = false as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  return (
    <FilterSelect
      multiple={multiple}
      iconLeft='calendar'
      options={DATE_PERIODS}
      translateOptionLabel
      {...restProps}
    />
  )
}
