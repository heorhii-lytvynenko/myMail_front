import { _dynamicGuestRoutes, _guestRoutes } from './guest'
import { _dynamicPrivateRoutes, _privateRoutes } from './private'
import { _dynamicPublicRoutes, _publicRoutes } from './public'

export const ROUTES = {
  ..._publicRoutes,
  ..._guestRoutes,
  ..._privateRoutes
} as const

export const DYNAMIC_ROUTES = {
  ..._dynamicPublicRoutes,
  ..._dynamicGuestRoutes,
  ..._dynamicPrivateRoutes
} as const

export type RouteType = keyof typeof ROUTES
