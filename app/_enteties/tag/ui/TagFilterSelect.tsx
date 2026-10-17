import { useTranslations } from 'next-intl'
import {
  FilterAsyncSelect,
  type FilterAsyncSelectProps
} from '@shared/ui/FilterAsyncSelect'
import { tagApi } from '../api'
import { tagKeys } from '../keys'
import type { TagType } from '../types'

type Props<TMultiple extends boolean> = Omit<
  FilterAsyncSelectProps<TagType, TMultiple>,
  'queryOptions' | 'initialIds'
>

export const TagFilterSelect = <TMultiple extends boolean = true>({
  multiple = true as TMultiple,
  ...restProps
}: Props<TMultiple>) => {
  const t = useTranslations('filters')

  return (
    <FilterAsyncSelect
      iconLeft='tag'
      multiple={multiple}
      placeholder={t('tags')}
      queryOptions={{
        queryKey: tagKeys.list(),
        queryFn: ({ filters }) => tagApi.getList(filters)
      }}
      initialIds={{
        queryOptions: {
          getQueryKey: (id) => tagKeys.detail(String(id)),
          queryFn: ({ id }) => tagApi.getById(String(id))
        }
      }}
      {...restProps}
    />
  )
}
