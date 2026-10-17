/* eslint-disable @next/next/no-img-element */
import { attributesToProps } from 'html-react-parser'
import { EMPTY_OBJECT } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import type { ParseHtmlTransformFn } from '../../types'

export const imageTransform: ParseHtmlTransformFn = (node) => {
  const { src, alt = '', style, ...rest } = node.attribs ?? EMPTY_OBJECT

  if (!src) {
    return null
  }

  const { className, ...restProps } = attributesToProps({
    style,
    ...rest
  })

  return (
    <img
      src={src}
      alt={alt}
      loading='lazy'
      decoding='async'
      className={cn(
        'max-w-full h-auto block object-cover object-center',
        className
      )}
      {...restProps}
    />
  )
}
