'use client'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { useRef } from 'react'
import { useParallax } from '@shared/lib/hooks'
import { cn } from '@shared/lib/utils'
import { Icon } from '@shared/ui/Icon'
import { Visible } from '@shared/ui/Visible'
import default_flow_image from '../../assets/default_flow_image.webp'
import { ImageButton } from './ui/ImageButton'

interface Props extends Partial<ImageProps> {
  slotProps?: {
    root?: ComponentProps<'div'>
  }
}

const FlowCardImage = ({
  src,
  className,
  slotProps,
  ...rest
}: Props) => {
  const { root } = slotProps ?? {}
  const { className: rootClassName, ...restRoot } = root ?? {}
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const { onMouseMove } = useParallax({
    layers: [{ ref: imageContainerRef, depth: 1 }],
    strength: 12
  })

  return (
    <Visible
      from='lg'
      className={cn(
        'w-full relative overflow-hidden min-h-[881px]',
        rootClassName
      )}
      {...restRoot}
    >
      <div
        ref={imageContainerRef}
        onMouseMove={onMouseMove}
        className={
          'absolute m-auto w-[calc(100%+20px) h-[calc(100%+20px)] -inset-10'
        }
      >
        <Image
          fill
          alt=''
          draggable={false}
          className={cn('object-center object-cover select-none', className)}
          src={src ?? default_flow_image}
          priority
          fetchPriority='high'
          sizes='(min-width: 1024px) 50vw, 0px'
          decoding='auto'
          {...rest}
        />
      </div>

      <div
        className={`
          w-full absolute left-0 top-0 px-8 pt-8 flex justify-between
          items-start
        `}
      >
        <div className='flex items-center gap-2'>
          <span className='rounded-full size-2 bg-[#05DF72] shrink-0' />
          <p
            className={`
              text-xs text-[#00D3F3CC] tracking-[1.2px] uppercase select-none
            `}
          >
            System Online
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <ImageButton iconLeft='flash' />
          <ImageButton iconLeft='scan' />
        </div>
      </div>

      <div className={'w-full absolute px-8 pb-8 bottom-0 left-0'}>
        <div
          className={`
            flex justify-between items-start border-t border-[#00b8db]/30 pt-4
          `}
        >
          <div className='flex flex-col gap-1'>
            <p className={'text-[10px] text-[#0092b8] uppercase select-none'}>
              Secure Connection
            </p>
            <div className='flex gap-1'>
              <div className='w-1 bg-[#00b8db]/50 rounded-full h-[6.53234px]' />
              <div className='w-1 bg-[#00b8db]/50 rounded-full h-[6.49995px]' />
              <div className='w-1 bg-[#00b8db]/50 rounded-full h-[7.9005px]' />
              <div className='w-1 bg-[#00b8db]/50 rounded-full h-[9.87829px]' />
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <p
              className={`
                flex items-center gap-2 text-xs uppercase text-[#00D3F3CC]
                select-none
              `}
            >
              <Icon name='activity' size={12} />
              System optimal
            </p>

            <p
              className={`
                text-slate-500 text-[10px] leading-none text-right select-none
              `}
            >
              v2.4.0-alpha
            </p>
          </div>
        </div>
      </div>
    </Visible>
  )
}

export { FlowCardImage as _FlowCardImage }
