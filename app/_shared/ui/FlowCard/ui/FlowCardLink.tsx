'use client'
import { useRouter } from '@shared/i18n/navigation'
import { cn } from '@shared/lib/utils'
import { Button, type ButtonProps } from '@shared/ui/Button'

export interface FlowCardLinkProps extends ButtonProps {
  href: string
}

const FlowCardLink = ({
  className,
  href,
  ...rest
}: FlowCardLinkProps) => {
  const router = useRouter()

  return (
    <Button
      variant='link'
      className={cn(
        `
          p-0 text-blue-700 h-auto font-medium
          hover:underline
        `,
        className
      )}
      onClick={() => router.push(href)}
      {...rest}
    />
  )
}

export { FlowCardLink as _FlowCardLink }
