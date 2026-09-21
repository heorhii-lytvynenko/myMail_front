'use client'
import type { ComponentProps, FC } from 'react'
import { Link } from '@shared/i18n/navigation'
import { useSearchParams } from '@shared/lib/hooks'
import { usePreviousPageStore } from '@shared/store'
import { getSafeFromParam } from './lib/getSafeFromParam'

export type BackLinkProps = {
  path: string
} & Omit<ComponentProps<typeof Link>, 'href'>

export const BackLink: FC<BackLinkProps> = ({
  path,
  onClick,
  ...restProps
}) => {
  const { getSearchParam } = useSearchParams()
  const updatePreviousPage = usePreviousPageStore(
    (state) => state.updatePreviousPage
  )

  return (
    <Link
      href={getSafeFromParam({ param: getSearchParam('from'), fallback: path })}
      onClick={(e) => {
        updatePreviousPage(path, {
          restore: true
        })

        onClick?.(e)
      }}
      {...restProps}
    />
  )
}
