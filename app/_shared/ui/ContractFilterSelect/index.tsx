import { useTranslations } from 'next-intl'
import { CONTRACTS } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof CONTRACTS)[number], TMultiple>,
  'options'
>

export const ContractFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      iconLeft='fileText'
      multiple={multiple}
      placeholder={t('contract')}
      options={CONTRACTS}
      translateOptionLabel
      {...restProps}
    />
  )
}
