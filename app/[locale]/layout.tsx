import { Providers } from "app/(app)/_providers"
import NextTopLoader from "nextjs-toploader"
import { ReactNode } from "react"

interface Props {
	children: ReactNode
	params: Promise<{ locale: string }>
}

const layout = async ({ children, params }: Props) => {
	const { locale } = await params

	return (
		<html lang={locale}>
			<body className='antialiased'>
				<NextTopLoader color='#1d4ed8' shadow={false} showSpinner={false} />

				<Providers>
					<main className='flex flex-col grow'>{children}</main>
				</Providers>
			</body>
		</html>
	)
}

export default layout