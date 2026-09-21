import { attributesToProps } from 'html-react-parser'
import { cn } from '@shared/lib/utils'
import type { ParseHtmlTransformFn } from '../../types'

export const ulTransform: ParseHtmlTransformFn = (node, children) => {
  const { className, ...restProps } = attributesToProps(node.attribs)

  return (
    <ul className={cn('flex flex-col gap-1', className)} {...restProps}>
      {children}
    </ul>
  )
}

export const liTransform: ParseHtmlTransformFn = (node, children) => {
  const { className, ...restProps } = attributesToProps(node.attribs)

  return (
    <li className={cn('pl-3 relative', className)} {...restProps}>
      <span
        className={cn(`
          absolute left-0 top-2 size-1 shrink-0 bg-slate-900 rounded-full
          pointer-events-none select-none
        `)}
      />

      {children}
    </li>
  )
}
