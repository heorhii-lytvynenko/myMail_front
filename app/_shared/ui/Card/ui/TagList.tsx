import type { FC, ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { ChipColor } from '@shared/ui/Chip'
import { Chip } from '@shared/ui/Chip'
import type { TagPreviewType } from '@entities/tag'

interface SlotProps {
  chip?: Partial<ComponentProps<typeof Chip>>
}

interface Props extends Omit<ComponentProps<'div'>, 'color'> {
  tags: TagPreviewType[] | null | undefined
  color?: ChipColor
  slotProps?: SlotProps
}

export const TagList: FC<Props> = ({
  tags,
  color = 'blue',
  slotProps,
  className
}) => {
  if (!tags?.length) return null

  const { className: chipClassName, ...props } = slotProps?.chip ?? {}

  return (
    <div className={cn('flex gap-2 flex-wrap', className)}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          color={color}
          {...props}
          className={cn('shrink-0', chipClassName)}
        >
          {tag.displayName}
        </Chip>
      ))}
    </div>
  )
}
