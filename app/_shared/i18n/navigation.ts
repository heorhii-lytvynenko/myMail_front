import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

const navigation = createNavigation(routing)

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname
} = navigation

export const useProgressRouter = useRouter
