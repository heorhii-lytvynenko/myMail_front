import { useTranslations } from 'next-intl'
import { EXPERIENCE_LEVELS } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof EXPERIENCE_LEVELS)[number], TMultiple>,
  'options'
>

export const ExperienceFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      iconLeft='star'
      multiple={multiple}
      placeholder={t('experience')}
      options={EXPERIENCE_LEVELS}
      translateOptionLabel
      {...restProps}
    />
  )
}
