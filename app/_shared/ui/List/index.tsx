import { Fragment, type ComponentProps, type ReactNode } from 'react'
import { NoData, type NoDataProps } from '../NoData'

export interface ListProps<T> extends ComponentProps<'div'> {
  data: T[] | undefined | null
  renderItem: (item: T, index: number) => ReactNode
  getItemKey: (item: T, index: number) => string | number
  isLoading?: boolean
  renderSkeleton?: (index: number) => ReactNode
  skeletonCount?: number
  slotProps?: {
    noData?: NoDataProps
  }
}

export const List = <T,>({
  data,
  renderItem,
  getItemKey,
  isLoading,
  skeletonCount = 10,
  renderSkeleton,
  slotProps,
  ...restProps
}: ListProps<T>) => {
  const { noData: noDataProps } = slotProps ?? {}

  if (isLoading) {
    return (
      <div {...restProps}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Fragment key={index}>{renderSkeleton?.(index)}</Fragment>
        ))}
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div {...restProps}>
        <NoData {...noDataProps} />
      </div>
    )
  }

  return (
    <div {...restProps}>
      {data.map((item, index) => {
        const key = getItemKey(item, index)

        return <Fragment key={key}>{renderItem(item, index)}</Fragment>
      })}
    </div>
  )
}
