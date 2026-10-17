import type { MediaType } from '@entities/media'

export interface AuthorType {
  id: number
  displayName: string
  avatar?: MediaType | null
}
