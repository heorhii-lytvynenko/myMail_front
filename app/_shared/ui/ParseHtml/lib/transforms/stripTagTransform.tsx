import type { ParseHtmlTransformFn } from '../../types'

export const stripTagTransform: ParseHtmlTransformFn = (_node, children) => {
  return <>{children}</>
}
