import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import { domToReact, Element } from 'html-react-parser'
import DOMPurify, { type Config as DOMPurifyConfig } from 'isomorphic-dompurify'
import type { HtmlTag, ParseHtmlTransformsMap } from '../types'

export const sanitiseHtml = (html: string, config: DOMPurifyConfig): string => {
  return DOMPurify.sanitize(html, config) as string
}

export const buildReplace = (
  transforms: ParseHtmlTransformsMap | undefined
): HTMLReactParserOptions['replace'] | undefined => {
  if (!transforms || Object.keys(transforms).length === 0) return undefined

  const replace: HTMLReactParserOptions['replace'] = (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) return undefined

    const handler = transforms[domNode.name as HtmlTag]

    if (!handler) return undefined

    const options: HTMLReactParserOptions = { replace }
    const children = domToReact(domNode.children as DOMNode[], options)

    return handler(domNode, children, options)
  }

  return replace
}
