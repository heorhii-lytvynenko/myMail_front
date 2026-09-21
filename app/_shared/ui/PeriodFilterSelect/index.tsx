import { useTranslations } from 'next-intl'
import { PERIODS } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof PERIODS)[number], TMultiple>,
  'options'
>

export const PeriodFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      multiple={multiple}
      iconLeft='calendar'
      placeholder={t('period')}
      options={PERIODS}
      translateOptionLabel
      {...restProps}
    />
  )
}
