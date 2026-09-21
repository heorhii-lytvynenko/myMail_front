import './(app)/_styles/tailwind.css'
import './(app)/_styles/globals.scss'
import type { Metadata, Viewport } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { type ReactNode } from 'react'
import { cn } from '@shared/lib/utils'
import { defaultLocale } from 'i18n/locales'
import { getInitialAppData } from './(app)/_lib'
import { Providers } from './(app)/_providers'
import { fontVariables } from './(app)/_fonts'


export const metadata: Metadata = {
	title: 'My mail',
	description: 'My mail'
}

export const viewport: Viewport = {
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'contain',
	width: 'device-width'
}

interface Props {
	children: ReactNode
}

const layout = async ({ children }: Props) => {
	const { account, onboardingState } = await getInitialAppData()

	return (
		<html className={cn(fontVariables)} lang={defaultLocale}>
			<body className='antialiased'>
				<NextTopLoader color='#1d4ed8' shadow={false} showSpinner={false} />

				<Providers account={account} onboardingState={onboardingState}>
					{/* <Header /> */}
					<main className='flex flex-col grow'>{children}</main>
					{/* <Footer /> */}
				</Providers>
			</body>
		</html>
	)
}

export default layout
