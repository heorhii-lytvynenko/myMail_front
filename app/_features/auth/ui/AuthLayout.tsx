import type { ReactNode } from 'react'
import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'

export function AuthLayout({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  return <main className='grid min-h-dvh place-items-center px-4 py-4 md:py-8'>
    <Page className='w-full max-w-md grow-0'>
      <Page.Content className='grow-0 gap-0 p-0'>
        <Section
          className='grow-0'
          aria-labelledby={labelledBy}
          slotProps={{ container: { className: 'grow-0 gap-0 p-0' } }}
        >
          <Section.Content className='grow-0'>
            <Section.Panel className='grow-0 gap-7 rounded-lg border border-panelBorder bg-panel/92 p-6 shadow-panel md:p-8 lg:max-w-none'>
              {children}
            </Section.Panel>
          </Section.Content>
        </Section>
      </Page.Content>
    </Page>
  </main>
}
