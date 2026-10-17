'use client'
import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { usePreviousPageStore } from '@shared/store'

export const RestorePreviousPageProvider = () => {
  const pathname = usePathname()
  const getPreviousPage = usePreviousPageStore((state) => state.getPreviousPage)
  const removePreviousPage = usePreviousPageStore(
    (state) => state.removePreviousPage
  )

  useLayoutEffect(() => {
    const page = getPreviousPage(pathname)

    if (!page) {
      return
    }

    const { restore, scrollY } = page

    if (!restore) {
      removePreviousPage(pathname)

      return
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })

    removePreviousPage(pathname)
  }, [pathname, getPreviousPage, removePreviousPage])

  return null
}
