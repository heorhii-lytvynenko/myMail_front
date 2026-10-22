import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { cn } from '@shared/lib/utils'
import type { ResponsivePopoverTriggerProps } from '@shared/ui/ResponsivePopover'
import { ResponsivePopover } from '@shared/ui/ResponsivePopover'
import type { FieldProps } from '../../Field'
import { Field } from '../../Field'
import type {
  SelectOptionType,
  SelectSizeType,
  SelectVariantType
} from '../types'

type Props<TValue extends SelectOptionType> = FieldProps & {
  value: TValue | TValue[] | null
  isOpen: boolean
  getOptionLabel: (option: TValue) => ReactNode
  variant: SelectVariantType
  size: SelectSizeType
  placeholder?: string
  translateOptionLabel?: boolean
  triggerButtonProps?: ResponsivePopoverTriggerProps
}

export const SelectPickerTrigger = <TValue extends SelectOptionType,>({
  value,
  placeholder = 'Select',
  isOpen,
  loading,
  name,
  label,
  error,
  helperText,
  iconLeft,
  iconRight = 'chevronDown',
  getOptionLabel,
  slotProps,
  triggerButtonProps,
  variant,
  translateOptionLabel,
  translateError,
  size,
  required
}: Props<TValue>) => {
  const t = useTranslations()
  const { iconRight: iconRightProps, root, ...restSlotProps } = slotProps ?? {}
  const { className: rootClassName, ...restRootProps } = root ?? {}
  const { className: iconRightClassName, ...restIconRightProps } =
    iconRightProps ?? {}
  const { className: triggerButtonClassName, ...restTriggerButtonProps } =
    triggerButtonProps ?? {}
  const valueArray = value ? (Array.isArray(value) ? value : [value]) : null

  return (
    <Field
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      iconLeft={iconLeft}
      iconRight={iconRight}
      loading={loading}
      translateError={translateError}
      required={required}
      slotProps={{
        root: {
          className: cn(
            variant === 'text' &&
              `
                group gap-1
                hover:text-blue-700
                data-[state=open]:text-blue-700
              `,
            rootClassName
          ),
          ...restRootProps
        },
        iconRight: {
          className: cn(
            'transition',
            isOpen && 'rotate-180',
            iconRightClassName
          ),
          ...restIconRightProps
        },
        ...restSlotProps
      }}
    >
      <ResponsivePopover.Trigger
        id={name}
        className={cn(
          `
            group field flex gap-2 items-center text-left transition-all
            [&>span]:line-clamp-1
          `,
          variant === 'field' &&
            `
              hover:border-blue-700 hover:bg-white
              data-[state=open]:border-blue-700 data-[state=open]:bg-white
            `,
          variant === 'text' &&
            `
              p-0 border-none h-auto font-bold text-slate-900 bg-transparent
              group-hover:text-blue-700
              data-[state=open]:text-blue-700
            `,
          size === 'm' && 'h-9',
          size === 'l' && 'h-11',
          triggerButtonClassName
        )}
        {...restTriggerButtonProps}
      >
        <span>
          {valueArray?.length
            ? valueArray
                .map((v) => {
                  const label = getOptionLabel(v)

                  return translateOptionLabel ? t(String(label)) : label
                })
                .join(', ')
            : placeholder}
        </span>
      </ResponsivePopover.Trigger>
    </Field>
  )
}
