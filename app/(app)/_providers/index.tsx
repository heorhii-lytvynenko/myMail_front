import { NextIntlClientProvider } from "next-intl"
import { PropsWithChildren } from "react"

interface Props {
	//not empty
}

export const Providers = ({
	children
}: PropsWithChildren<Props>) => {
	return (
		<NextIntlClientProvider>
			{children}
		</NextIntlClientProvider>
	)
}
