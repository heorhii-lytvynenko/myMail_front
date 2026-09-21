import type { HTMLReactParserOptions, Element } from 'html-react-parser'
import type { ElementType, JSX } from 'react'
import { type ReactNode } from 'react'

export type HtmlTag = keyof React.JSX.IntrinsicElements

export type ParseHtmlTransformFn = (
  node: Element,
  children: ReactNode,
  options: HTMLReactParserOptions
) => JSX.Element | null | undefined

export type ParseHtmlTransformsMap = Partial<
  Record<HtmlTag, ParseHtmlTransformFn>
>

export type AdditionalParseHtmlProps<T extends ElementType | null> =
  T extends null
    ? Record<string, never>
    : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : React.ComponentPropsWithoutRef<Exclude<T, null>>
