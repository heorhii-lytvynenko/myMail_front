'use client'
import { cn, defaultGetOptionLabel, isSameOption } from '@shared/lib/utils'
import { type FieldProps } from '../Field'
import type { InfiniteScrollProps } from '../InfinityScroll'
import type { NoDataProps } from '../NoData'
import {
  ResponsivePopover,
  type ResponsivePopoverContentProps,
  type ResponsivePopoverTriggerProps
} from '../ResponsivePopover'
import { useSelectPicker } from './hooks/useSelectPicker'
import type {
  SelectOptionType,
  SelectSizeType,
  SelectValueType,
  SelectVariantType
} from './types'
import { SelectPickerActions } from './ui/SelectPickerActions'
import { SelectPickerOptions } from './ui/SelectPickerOptions'
import { SelectPickerSearch } from './ui/SelectPickerSearch'
import { SelectPickerTrigger } from './ui/SelectPickerTrigger'

export type SelectPickerProps<
  TValue extends SelectOptionType,
  TMultiple extends boolean = false
> = Omit<FieldProps, 'slotProps'> & {
  name: string
  options: Readonly<TValue[]>
  value: SelectValueType<TValue, TMultiple>
  onChange: (value: SelectValueType<TValue, TMultiple>) => void
  fixedValue?: SelectValueType<TValue, TMultiple>
  multiple?: TMultiple
  placeholder?: string
  getOptionLabel?: (option: TValue) => string | number
  onOptionClick?: (value: TValue) => void
  search?: string
  onSearch?: (search: string) => void
  hasSearch?: boolean
  onOpenChange?: (open: boolean) => void
  optionsLoading?: boolean
  variant?: SelectVariantType
  size?: SelectSizeType
  fitContent?: boolean
  translateOptionLabel?: boolean
  slotProps?: {
    field?: FieldProps['slotProps']
    trigger?: ResponsivePopoverTriggerProps
    infiniteScroll?: InfiniteScrollProps
    noData?: NoDataProps
    popoverContent?: ResponsivePopoverContentProps
  }
}

export const SelectPicker = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false
>({
  value: selectValue,
  options,
  onChange,
  multiple,
  getOptionLabel = defaultGetOptionLabel,
  onOptionClick,
  search,
  onSearch,
  hasSearch = true,
  onOpenChange,
  loading,
  optionsLoading,
  slotProps,
  variant = 'field',
  fitContent,
  translateOptionLabel,
  fixedValue,
  placeholder,
  size = 'm',
  ...triggerProps
}: SelectPickerProps<TValue, TMultiple>) => {
  const { isOpen, setIsOpen, value, setValue, initialValue, emptyValue } =
    useSelectPicker(selectValue, multiple, fixedValue)
  const {
    field: fieldProps,
    noData: noDataProps,
    infiniteScroll: infiniteScrollProps,
    trigger: triggerButtonProps,
    popoverContent: popoverContentProps
  } = slotProps ?? {}
  const { className: popoverContentClassName, ...restPopoverContentProps } =
    popoverContentProps ?? {}

  const handleApply = (nextValue: SelectValueType<TValue, TMultiple>) => {
    onChange(nextValue)
    setIsOpen(false)
    onSearch?.('')
  }

  return (
    <ResponsivePopover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        onOpenChange?.(open)

        if (!open) {
          setValue?.(initialValue)

          setTimeout(() => {
            onSearch?.('')
          }, 150)
        }
      }}
    >
      <SelectPickerTrigger
        value={initialValue}
        getOptionLabel={getOptionLabel}
        isOpen={isOpen}
        slotProps={fieldProps}
        loading={loading}
        triggerButtonProps={triggerButtonProps}
        variant={variant}
        translateOptionLabel={translateOptionLabel}
        placeholder={placeholder}
        size={size}
        {...triggerProps}
      />

      <ResponsivePopover.Content
        className={cn('max-lg:h-full', popoverContentClassName)}
        {...restPopoverContentProps}
      >
        <ResponsivePopover.Title>{placeholder}</ResponsivePopover.Title>

        {hasSearch && (
          <SelectPickerSearch search={search} onSearch={onSearch} />
        )}

        <SelectPickerOptions
          fitContent={fitContent}
          multiple={multiple}
          options={options}
          translateOptionLabel={translateOptionLabel}
          getOptionLabel={getOptionLabel}
          onOptionClick={(option: TValue) => {
            if (multiple) {
              setValue?.((prev) => {
                let val = prev ? (Array.isArray(prev) ? prev : [prev]) : []
                const fixedVal = fixedValue
                  ? Array.isArray(fixedValue)
                    ? fixedValue
                    : [fixedValue]
                  : []

                return val.find((v) => isSameOption(v, option))
                  ? val.filter((v) => {
                      const isFixed = fixedVal.some((f) => f.id === v.id)

                      if (isFixed) {
                        return true
                      }

                      return !isSameOption(v, option)
                    })
                  : ([...val, option] as any)
              })
            } else {
              setValue?.((prev) => {
                let val = prev as TValue | null
                const nextValue = isSameOption(val, option)
                  ? null
                  : (option as any)

                if (fixedValue && !nextValue) {
                  setIsOpen(false)
                  onSearch?.('')

                  return val
                }

                handleApply(nextValue)

                return nextValue
              })
            }

            onOptionClick?.(option)
          }}
          getIsActive={(option: TValue) => {
            if (multiple) {
              let val = value ? (Array.isArray(value) ? value : [value]) : []

              return !!val.find((v) => isSameOption(v, option))
            } else {
              let val = value as TValue | null

              return isSameOption(val, option)
            }
          }}
          optionsLoading={optionsLoading}
          infiniteScrollProps={infiniteScrollProps}
          noDataProps={noDataProps}
        />

        {multiple && (
          <SelectPickerActions
            onReset={() => {
              setValue(emptyValue)
              onChange(emptyValue)
              setIsOpen(false)
              onSearch?.('')
            }}
            onApply={() => handleApply(value)}
          />
        )}
      </ResponsivePopover.Content>
    </ResponsivePopover>
  )
}
