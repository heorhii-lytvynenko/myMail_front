import { attributesToProps } from 'html-react-parser'
import type { ParseHtmlTransformFn } from '../../types'

export const tableTransform: ParseHtmlTransformFn = (node, children) => {
  const props = attributesToProps(node.attribs)

  return (
    <div className='overflow-x-auto w-full'>
      <table {...props}>{children}</table>
    </div>
  )
}
