import type { ComponentProps } from 'react'
import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import type { ContainerProps } from '../Container'
import { Container } from '../Container'
import { Icon } from '../Icon'

export interface SectionProps extends ComponentProps<'section'> {
  slotProps?: {
    container?: ContainerProps
  }
}

export const Section = ({
  children,
  className,
  slotProps,
  ...restProps
}: SectionProps) => {
  const { container } = slotProps ?? {}

  return (
    <section
      className={cn('flex flex-col grow gap-6', className)}
      {...restProps}
    >
      <Container {...container}>{children}</Container>
    </section>
  )
}

export type SectionRowProps = ComponentProps<'div'>

const Row = ({ className, ...restProps }: SectionRowProps) => {
  return (
    <div
      className={cn(
        `
          flex flex-col
          lg:flex-row
          grow gap-4
        `,
        className
      )}
      {...restProps}
    />
  )
}

export type SectionContentProps = ComponentProps<'div'>

const Content = ({ className, ...restProps }: SectionContentProps) => {
  return (
    <div
      className={cn('flex flex-col grow gap-4 w-full', className)}
      {...restProps}
    />
  )
}

export type SectionPanelProps = ComponentProps<'div'>

const Panel = ({ className, ...restProps }: SectionPanelProps) => {
  return (
    <div
      className={cn(
        `
          flex-col grow flex gap-6
          lg:max-w-70
          w-full shrink-0
        `,
        className
      )}
      {...restProps}
    />
  )
}

export type PanelBlockProps = ComponentProps<'section'>

const PanelBlock = ({ className, ...restProps }: PanelBlockProps) => {
  return (
    <section className={cn('flex flex-col gap-4', className)} {...restProps} />
  )
}

export type PanelStickyProps = ComponentProps<'div'>

const PanelSticky = ({ className, ...restProps }: PanelStickyProps) => {
  return (
    <div
      className={cn(
        'lg:sticky lg:top-[calc(var(--header-height)+16px)] lg:z-[1]',
        className
      )}
      {...restProps}
    />
  )
}

export interface PanelTitleProps extends ComponentProps<'h2'> {
  as?: 'h1' | 'h2' | 'h3'
  icon?: IconType
}

const PanelTitle = ({ as: Heading = 'h2', icon, className, ...restProps }: PanelTitleProps) => {
  return (
    <div className='flex items-center gap-2'>
      <Icon name={icon} size={20} />

      <Heading
        className={cn(
          'font-medium text-base flex items-center gap-2',
          className
        )}
        {...restProps}
      />
    </div>
  )
}

Section.Row = Row
Section.Content = Content
Section.Panel = Panel
Panel.Block = PanelBlock
Panel.Sticky = PanelSticky
Panel.Title = PanelTitle
