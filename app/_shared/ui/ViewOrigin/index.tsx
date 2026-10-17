import type { ReactNode } from 'react'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { IconBox } from '@shared/ui/IconBox'

export interface ViewOriginProps {
  href?: string | null
  title: ReactNode
  description: ReactNode
}

export const ViewOrigin = ({ href, title, description }: ViewOriginProps) => {
  if (!href) {
    return null
  }

  return (
    <Card
      action={{
        as: 'a',
        href,
        target: '_blank',
        rel: 'noopener noreferrer'
      }}
    >
      <div className='flex items-center gap-4'>
        <IconBox name='globe' className='self-start text-blue-600' />

        <div className='grow flex flex-col gap-0.5'>
          <Card.Title size='sm'>{title}</Card.Title>

          <p className='text-xs font-medium text-slate-500'>{description}</p>
        </div>

        <Button
          as='div'
          variant='ghost'
          size='icon-l'
          iconLeft='externalLink'
          className='pointer-events-none self-start'
        />
      </div>
    </Card>
  )
}
