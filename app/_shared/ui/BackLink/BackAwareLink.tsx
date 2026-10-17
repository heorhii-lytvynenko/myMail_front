'use client'
import type { ComponentProps } from 'react'
import { Link, usePathname } from '@shared/i18n/navigation'
import { useSearchParams } from '@shared/lib/hooks'
import { usePreviousPageStore } from '@shared/store'
import { stripFromParam } from './lib/stripFromParam'
import { withFromParam } from './lib/withFromParam'

export interface BackAwareLinkProps extends ComponentProps<typeof Link> {
  withFrom?: boolean
}

export const BackAwareLink = ({
  onClick,
  href,
  withFrom = true,
  ...props
}: BackAwareLinkProps) => {
  const pathname = usePathname()
  const { searchParams } = useSearchParams()
  const savePreviousPage = usePreviousPageStore(
    (state) => state.savePreviousPage
  )
  const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`
  const cleanHref = stripFromParam(currentHref)

  return (
    <Link
      onClick={(e) => {
        savePreviousPage(pathname, {
          href: cleanHref,
          scrollY: window.scrollY
        })

        onClick?.(e)
      }}
      href={withFrom ? withFromParam(cleanHref, href) : href}
      {...props}
    />
  )
}
