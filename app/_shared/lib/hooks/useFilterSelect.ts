import { useEffect, useMemo, useState } from 'react'
import { EMPTY_ARRAY } from '@shared/lib/const'
import { useSearchParams } from '@shared/lib/hooks'
import { equalIds, isSameOption } from '@shared/lib/utils'
import type { SelectOptionType, SelectValueType } from '@shared/ui/SelectPicker'

export const useFilterSelect = <
  TValue extends SelectOptionType,
  TMultiple extends boolean
>({
  name,
  multiple,
  options
}: {
  name: string | undefined
  multiple: TMultiple | undefined
  options?: readonly TValue[]
}) => {
  const { getSearchParam, setSearchParam } = useSearchParams()

  const getParamIds = () => {
    if (multiple) {
      const ids = getSearchParam<string[]>(name, { format: 'array' })

      if (!ids?.length) {
        return EMPTY_ARRAY
      }

      return Array.from(new Set(ids))
    } else {
      return getSearchParam(name)
    }
  }

  const paramValue = useMemo(getParamIds, [getSearchParam, name, multiple])

  const [value, setValue] = useState<SelectValueType<TValue, TMultiple>>(() => {
    if (multiple) {
      let ids = paramValue as string[]

      if (!options) {
        return [] as unknown as SelectValueType<TValue, TMultiple>
      }

      return ids
        .map((id) => options.find((o) => isSameOption(o, { id })))
        .filter((v) => !!v) as SelectValueType<TValue, TMultiple>
    } else {
      let id = paramValue as string

      if (!options) {
        return null as SelectValueType<TValue, TMultiple>
      }

      return (options.find((o) => isSameOption(o, { id })) ??
        null) as SelectValueType<TValue, TMultiple>
    }
  })

  useEffect(() => {
    if (!options) {
      return
    }

    if (multiple) {
      const val = value ? (Array.isArray(value) ? value : [value]) : []
      const valueIds = val.map((v) => String(v.id))

      let paramIds = paramValue as string[]

      if (equalIds(paramIds, valueIds)) {
        return
      }

      setValue(
        paramIds
          .map((id) => options.find((o) => isSameOption(o, { id })))
          .filter((v) => !!v) as SelectValueType<TValue, TMultiple>
      )
    } else {
      let id = paramValue as string

      setValue(
        (options.find((o) => isSameOption(o, { id })) ??
          null) as SelectValueType<TValue, TMultiple>
      )
    }
  }, [paramValue, multiple, options])

  const setFilterValue = (nextValue: SelectValueType<TValue, TMultiple>) => {
    setValue(nextValue)

    if (!name) {
      return
    }

    if (multiple) {
      const nextVal = nextValue
        ? Array.isArray(nextValue)
          ? nextValue
          : [nextValue]
        : ([] as TValue[])

      const nextIds = nextVal.map((v) => String(v.id))

      setTimeout(() => setSearchParam(name, nextIds), 150)
    } else {
      const nextVal = nextValue as TValue | null

      setTimeout(() => setSearchParam(name, nextVal?.id), 150)
    }
  }

  return { value, paramValue, setFilterValue }
}
