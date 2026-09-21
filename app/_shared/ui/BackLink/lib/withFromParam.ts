import type { UrlObject } from 'url'
import { isType } from '@shared/lib/utils'

export const withFromParam = (from: string, href: string | UrlObject) => {
  if (!isType.string(href)) {
    return href
  }

  const [path, q = ''] = href.split('?')
  const params = new URLSearchParams(q)

  params.set('from', from)

  return `${path}${params.toString() ? `?${params}` : ''}`
}
