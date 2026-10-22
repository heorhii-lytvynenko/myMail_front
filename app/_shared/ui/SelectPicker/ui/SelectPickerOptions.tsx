import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslations } from 'next-intl'
import { useRef, type ReactNode } from 'react'
import { cn } from '@shared/lib/utils'
import { DeferredRender } from '@shared/ui/DeferredRender'
import { Icon } from '@shared/ui/Icon'
import { Spinner } from '@shared/ui/Spinner'
import { Checkbox } from '../../Checkbox'
import type { InfiniteScrollProps } from '../../InfinityScroll'
import { InfiniteScroll } from '../../InfinityScroll'
import type { NoDataProps } from '../../NoData'
import { NoData } from '../../NoData'
import type { SelectOptionType } from '../types'

interface Props<TValue extends SelectOptionType> {
  multiple: boolean | undefined
  fitContent: boolean | undefined
  options: readonly TValue[]
  onOptionClick: (option: TValue) => void
  getOptionLabel: (option: TValue) => ReactNode
  getIsActive: (option: TValue) => boolean
  optionsLoading?: boolean
  translateOptionLabel?: boolean
  infiniteScrollProps?: InfiniteScrollProps
  noDataProps?: NoDataProps
}

export const SelectPickerOptions = <TValue extends SelectOptionType,>({
  multiple,
  fitContent,
  options,
  onOptionClick,
  getOptionLabel,
  getIsActive,
  optionsLoading,
  translateOptionLabel,
  infiniteScrollProps,
  noDataProps
}: Props<TValue>) => {
  'use no memo'
  // TanStack Virtual exposes mutable instance methods; keep this boundary
  // outside compiler memoization so scrolling observes fresh measurements.
  const t = useTranslations()
  const listRef = useRef<HTMLDivElement | null>(null)
  const {
    className: noDataClassName,
    imageProps,
    contentProps,
    titleProps,
    ...restNoData
  } = noDataProps ?? {}
  const {
    className: scrollClassName,
    style: scrollStyle,
    isLoading: infiniteIsLoading,
    ...restScrollProps
  } = infiniteScrollProps ?? {}
  const rowVirtualizer = useVirtualizer({
    overscan: 5,
    getScrollElement: () => listRef.current,
    estimateSize: () => 40,
    count: options.length
  })

  if (optionsLoading) {
    return (
      <div className={cn('flex grow items-center justify-center h-[212px]')}>
        <DeferredRender>
          <Spinner className='size-5' />
        </DeferredRender>
      </div>
    )
  }

  if (!options.length) {
    return (
      <NoData
        className={cn('h-[212px]', noDataClassName)}
        imageProps={{
          width: 40,
          height: 40,
          ...imageProps
        }}
        title={t('filters.nothingFound')}
        titleProps={{
          ...titleProps,
          className: cn('text-sm font-bold', titleProps?.className)
        }}
        contentProps={contentProps}
        {...restNoData}
      />
    )
  }

  return (
    <div className='p-0.5 flex flex-col grow overflow-hidden'>
      <div
        ref={listRef}
        className={cn(
          `
            scrollbar-blackAlpha10 overflow-auto overflow-x-hidden grow
            lg:max-h-[208px]
          `,
          !fitContent && 'lg:h-[208px]'
        )}
      >
        <InfiniteScroll
          className={cn('relative m-1.5', scrollClassName)}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            ...scrollStyle
          }}
          isLoading={infiniteIsLoading}
          {...restScrollProps}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const option = options[virtualRow.index]
            const isLast = virtualRow.index === options.length - 1
            const isAvtive = getIsActive(option)
            const label = getOptionLabel(option)

            return (
              <div
                key={option.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={cn(
                  'absolute left-0 top-0 w-full pb-2',
                  isLast && 'pb-0'
                )}
                style={{
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <button
                  onClick={() => onOptionClick?.(option)}
                  className={cn(
                    `
                      relative rounded-md text-base flex w-full cursor-pointer
                      select-none items-center gap-2 p-2 h-11 transition
                      text-left
                      hover:bg-slate-50
                      data-[disabled]:pointer-events-none
                      data-[disabled]:opacity-50
                      [&>span]:line-clamp-1 [&>span]:grow
                      lg:font-medium lg:text-sm lg:h-8
                    `
                  )}
                  type='button'
                >
                  {multiple && (
                    <Checkbox
                      boxProps={{ className: 'max-lg:size-5' }}
                      checked={isAvtive}
                      asChild
                    />
                  )}

                  {option.iconLeft && (
                    <Icon
                      name={option.iconLeft}
                      className={`
                        size-5
                        lg:size-4
                      `}
                    />
                  )}

                  <span>{translateOptionLabel ? t(String(label)) : label}</span>

                  {!multiple && isAvtive && (
                    <Icon
                      name='check'
                      className={`
                        size-5
                        lg:size-4
                      `}
                    />
                  )}
                </button>
              </div>
            )
          })}
        </InfiniteScroll>

        {infiniteIsLoading && (
          <div className='flex items-center justify-center pb-3 px-2'>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}
