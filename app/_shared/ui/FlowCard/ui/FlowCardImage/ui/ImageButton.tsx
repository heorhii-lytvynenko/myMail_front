import { cn } from '@shared/lib/utils'
import type { ButtonProps } from '@shared/ui/Button'
import { Button } from '@shared/ui/Button'

type Props = ButtonProps

export const ImageButton = ({ className, ...rest }: Props) => {
  return (
    <Button
      size='icon-s'
      variant='ghost'
      className={cn(
        `
          border border-[#104E644D] text-[#00D3F2]
          hover:bg-[#053345]/30 hover:text-[#a2f4fd]
        `,
        className
      )}
      {...rest}
    />
  )
}
