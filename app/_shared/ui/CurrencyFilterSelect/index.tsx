import { useTranslations } from 'next-intl'
import { CURRENCIES } from '@shared/lib/const'
import type { FilterSelectProps } from '@shared/ui/FilterSelect'
import { FilterSelect } from '@shared/ui/FilterSelect'

type Props<TMultiple extends boolean> = Omit<
  FilterSelectProps<(typeof CURRENCIES)[number], TMultiple>,
  'options'
>

export const CurrencyFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterSelect
      multiple={multiple}
      iconLeft='coins'
      placeholder={t('currency')}
      options={CURRENCIES}
      translateOptionLabel
      {...restProps}
    />
  )
}
