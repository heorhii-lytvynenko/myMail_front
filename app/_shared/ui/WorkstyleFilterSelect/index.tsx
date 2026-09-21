import { useTranslations } from 'next-intl'
import { WORKSTYLES } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof WORKSTYLES)[number], TMultiple>,
  'options'
>

export const WorkstyleFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      iconLeft='globe'
      multiple={multiple}
      placeholder={t('jobType')}
      options={WORKSTYLES}
      translateOptionLabel
      {...restProps}
    />
  )
}
