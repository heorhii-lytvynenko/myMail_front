import { usePathname } from '@shared/i18n/navigation'

export const useActivePathname = (pathname: string): boolean => {
  const currentPathname = usePathname()

  if (pathname === '/') {
    return currentPathname === '/'
  }

  if (pathname !== '/' && currentPathname.startsWith(pathname)) {
    return true
  }

  return false
}
