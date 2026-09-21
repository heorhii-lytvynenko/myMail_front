import { type Config as DOMPurifyConfig } from 'isomorphic-dompurify'

export const DEFAULT_PURIFY_CONFIG: DOMPurifyConfig = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: [
    'html',
    'head',
    'body',
    'meta',
    'title',
    'link',
    'base',
    'script',
    'style',
    'noscript',
    'iframe',
    'object',
    'embed'
  ],
  ALLOWED_ATTR: [
    'href',
    'src',
    'srcset',
    'sizes',
    'alt',
    'title',
    'target',
    'rel',
    'type',

    'width',
    'height',
    'loading',
    'decoding',

    'colspan',
    'rowspan',
    'scope',

    'lang',
    'dir',
    'datetime',
    'cite',

    'disabled',
    'readonly',
    'checked',
    'selected',

    'start',
    'reversed',

    'open',

    'id',
    'class'
  ],
  ALLOW_DATA_ATTR: true
}
