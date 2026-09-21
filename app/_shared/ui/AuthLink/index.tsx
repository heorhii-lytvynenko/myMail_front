'use client'
import type { ComponentProps } from 'react'
import { Link as NavigationLink } from '@shared/i18n/navigation'
import { useAuthRoute } from '@entities/onboarding/client'

export interface AuthLinkProps extends Omit<
  ComponentProps<typeof NavigationLink>,
  'href'
> {
  href: string
}

export const AuthLink = ({ href, ...rest }: AuthLinkProps) => {
  const { resolve } = useAuthRoute()

  return <NavigationLink href={resolve(href)} {...rest} />
}
