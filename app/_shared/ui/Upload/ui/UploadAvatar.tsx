import type { ReactNode } from 'react'
import { Button } from '@shared/ui/Button'
import { FilePreview } from '@shared/ui/FilePreview'
import { Icon } from '@shared/ui/Icon'
import type { UploadZoneProps } from './UploadZone'
import { UploadZone } from './UploadZone'

export interface UploadAvatarProps extends Omit<
  UploadZoneProps,
  'multiple' | 'maxFiles'
> {
  value: File | undefined
  onChange: (value: File | undefined) => void
  label?: ReactNode
}

export const UploadAvatar = ({
  label,
  value,
  onChange,
  ...rest
}: UploadAvatarProps) => {
  return (
    <UploadZone onChange={onChange} {...rest}>
      <div className={'flex flex-col gap-3 justify-center items-center group'}>
        <div
          className={`
            relative size-24 shrink-0 flex rounded-full items-center
            justify-center bg-gray-50 border-gray-200 border border-dashed
            transition
            group-hover:bg-gray-100 group-hover:opacity-90
          `}
        >
          {value ? (
            <div
              className={`
                absolute inset-0 flex items-center justify-center flex-col
                rounded-[inherit] group
              `}
            >
              <FilePreview
                fill
                file={value}
                className={'object-cover object-center rounded-[inherit]'}
              />

              <Button
                iconLeft='x'
                size='icon-s'
                variant='secondary'
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(undefined)
                }}
                className={`
                  absolute opacity-0 right-0 top-0 invisible transition-all
                  size-7
                  group-hover:opacity-100 group-hover:visible
                `}
              />
            </div>
          ) : (
            <Icon name='camera' size={32} className='text-slate-400' />
          )}
        </div>

        {label && (
          <span
            className={`
              text-blue-700 font-medium transition
              group-hover:text-blue-800
            `}
          >
            {label}
          </span>
        )}
      </div>
    </UploadZone>
  )
}
