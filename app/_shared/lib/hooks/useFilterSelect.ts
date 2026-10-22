import { useEffect, useMemo, useRef, useState } from 'react'
import { EMPTY_ARRAY } from '@shared/lib/const'
import { useSearchParams } from '@shared/lib/hooks'
import { isSameOption } from '@shared/lib/utils'
import type { SelectOptionType, SelectValueType } from '@shared/ui/SelectPicker'

export const useFilterSelect = <TValue extends SelectOptionType, TMultiple extends boolean>({ name, multiple, options }: {
  name: string | undefined; multiple: TMultiple | undefined; options?: readonly TValue[]
}) => {
  const { getSearchParam, setSearchParam } = useSearchParams()
  const raw = getSearchParam(name)
  const paramValue = useMemo(() => multiple ? raw ? [...new Set(raw.split(',').map(value => value.trim()))] : EMPTY_ARRAY : raw, [raw, multiple])
  const selected = () => (multiple ? (paramValue as readonly string[]).flatMap(id => {
    const match = options?.find(option => isSameOption(option, { id }))
    return match ? [match] : []
  }) : options?.find(option => isSameOption(option, { id: paramValue as string })) ?? null) as SelectValueType<TValue, TMultiple>
  const [snapshot, setSnapshot] = useState(() => ({ paramValue, options, value: selected() }))
  if (snapshot.paramValue !== paramValue || snapshot.options !== options) {
    setSnapshot({ paramValue, options, value: options ? selected() : snapshot.value })
  }
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const setFilterValue = (value: SelectValueType<TValue, TMultiple>) => {
    setSnapshot({ paramValue, options, value })
    if (!name) return
    if (timer.current) clearTimeout(timer.current)
    const values = value ? Array.isArray(value) ? value : [value] : []
    timer.current = setTimeout(() => setSearchParam(name, multiple ? values.map(option => String(option.id)) : values[0]?.id), 150)
  }
  return { value: snapshot.value, paramValue, setFilterValue }
}
