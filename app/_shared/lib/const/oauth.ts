import type { IconType } from './icons'

export const OAUTH_PROVIDERS = [
  {
    id: 'apple',
    displayName: 'apple',
    icon: 'apple'
  },
  {
    id: 'google',
    displayName: 'google',
    icon: 'google'
  }
] as const satisfies {
  id: string
  displayName: string
  icon: IconType
}[]

export type OAuthProviderItem = (typeof OAUTH_PROVIDERS)[number]
export type OAuthProvider = OAuthProviderItem['id']
