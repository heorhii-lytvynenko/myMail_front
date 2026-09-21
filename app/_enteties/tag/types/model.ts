import type { MediaType } from '@entities/media'

export interface TagType {
  id: number
  name: string
  displayName: string
  logo?: MediaType | null
  description: string
  updatedAt: string
  createdAt: string
}

export interface TagPreviewType {
  id: number
  name: string
  displayName: string
  logo?: MediaType | null
}
