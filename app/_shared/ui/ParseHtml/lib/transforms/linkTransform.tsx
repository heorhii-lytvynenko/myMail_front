import { attributesToProps } from 'html-react-parser'
import { Link } from '@shared/i18n/navigation'
import { EMPTY_OBJECT } from '@shared/lib/const'
import type { ParseHtmlTransformFn } from '../../types'

export const linkTransform: ParseHtmlTransformFn = (node, children) => {
  const { href, ...rest } = node.attribs ?? EMPTY_OBJECT

  if (!href) return undefined

  const restProps = attributesToProps(rest)

  let isExternal = false
  let finalHref = href

  try {
    const url = new URL(href)
    const appUrl = new URL(process.env.NEXT_PUBLIC_FRONTEND_URL ?? '')

    if (url.hostname === appUrl.hostname) {
      finalHref = url.pathname + url.search + url.hash
    } else {
      isExternal = true
    }
  } catch {
    /* relative URL */
  }

  if (isExternal) {
    return (
      <a
        href={finalHref}
        target='_blank'
        rel='noopener noreferrer nofollow'
        {...restProps}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={finalHref} {...restProps}>
      {children}
    </Link>
  )
}
