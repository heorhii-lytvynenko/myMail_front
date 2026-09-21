import type { ParseHtmlTransformsMap } from '../../types'
import {
  imageTransform,
  linkTransform,
  liTransform,
  tableTransform,
  ulTransform
} from '../transforms'

export const DEFAULT_TRANSFORMS: ParseHtmlTransformsMap = {
  img: imageTransform,
  a: linkTransform,
  table: tableTransform,
  ul: ulTransform,
  li: liTransform
}
