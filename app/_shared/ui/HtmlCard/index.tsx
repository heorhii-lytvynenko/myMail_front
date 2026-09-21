'use client'
import { type ReactNode } from 'react'
import type { IconType } from '@shared/lib/const'
import { Card } from '@shared/ui/Card'
import { Icon } from '@shared/ui/Icon'
import { ParseHtml } from '../ParseHtml'

interface Props {
  icon: IconType
  title: ReactNode
  html: string | null | undefined
}

export const HtmlCard = ({ icon, title, html }: Props) => {
  if (!html) {
    return null
  }

  return (
    <Card className='p-6' slotProps={{ content: { className: 'gap-4' } }}>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center h-7 self-start'>
          <Icon name={icon} size={20} className='text-blue-600' />
        </div>

        <Card.Title>{title}</Card.Title>
      </div>

      <ParseHtml html={html} className='text-slate-600' />
    </Card>
  )
}
