import { useTranslations } from 'next-intl'
import { EMPLOYMENT_MODES } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof EMPLOYMENT_MODES)[number], TMultiple>,
  'options'
>

export const EmploymentFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      iconLeft='clock'
      multiple={multiple}
      placeholder={t('employment')}
      options={EMPLOYMENT_MODES}
      translateOptionLabel
      {...restProps}
    />
  )
}
