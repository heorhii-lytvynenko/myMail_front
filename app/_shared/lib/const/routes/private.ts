import { _dynamiconboardingRoutes, _onboardingRoutes } from './onboarding'

export const _privateRoutes = {
  ..._onboardingRoutes,
  profile: '/profile'
} as const

export const _dynamicPrivateRoutes = {
  ..._dynamiconboardingRoutes
} as const
