import parse from 'html-react-parser'
import { type Config as DOMPurifyConfig } from 'isomorphic-dompurify'
import { useMemo, createElement, type ElementType } from 'react'
import { DEFAULT_PURIFY_CONFIG } from './lib/const/purify'
import { DEFAULT_TRANSFORMS } from './lib/const/transforms'
import { buildReplace, sanitiseHtml } from './lib/utils'
import type { AdditionalParseHtmlProps, ParseHtmlTransformsMap } from './types'

export type ParseHtmlProps<T extends ElementType | null = 'div'> = {
  html: string
  as?: T
  transforms?: ParseHtmlTransformsMap
  sanitize?: boolean
  sanitizeConfig?: DOMPurifyConfig
  trim?: boolean
} & AdditionalParseHtmlProps<T>

export const ParseHtml = <T extends ElementType | null = 'div'>({
  html,
  transforms,
  sanitize = true,
  sanitizeConfig,
  as: Tag = 'div' as T,
  trim = true,
  ...restProps
}: ParseHtmlProps<T>) => {

  const cleanHtml = useMemo(() => {
    if (!html) return ''
    if (!sanitize) return html

    return sanitiseHtml(html, {
      ...DEFAULT_PURIFY_CONFIG,
      ...sanitizeConfig
    })
  }, [html, sanitize, sanitizeConfig])

  const replace = useMemo(() => {
    return buildReplace({ ...DEFAULT_TRANSFORMS, ...transforms })
  }, [transforms])

  const content = useMemo(() => {
    return parse(cleanHtml, { replace, trim })
  }, [cleanHtml, replace, trim])

  if (!cleanHtml) {
    return null
  }

  if (!Tag) {
    return <>{content}</>
  }

  return createElement(Tag, restProps, content)
}
