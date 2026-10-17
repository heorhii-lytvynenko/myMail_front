'use client'
import { useState } from 'react'
import { Button } from './Button'
import type { InputProps } from './Input'
import { Input } from './Input'

export type PasswordInputProps = Omit<InputProps, 'type'>

export const PasswordInput = ({ ...rest }: PasswordInputProps) => {
  const [type, setType] = useState<'password' | 'text'>('password')

  return (
    <Input
      type={type}
      className='pr-11'
      renderRight={() => (
        <Button
          onClick={() => setType(type === 'password' ? 'text' : 'password')}
          className={`
            absolute right-0 top-0 aspect-square h-full w-auto p-0
            hover:bg-transparent
          `}
          variant='ghost'
          iconRight={type === 'password' ? 'eye' : 'eyeOff'}
        />
      )}
      {...rest}
    />
  )
}
