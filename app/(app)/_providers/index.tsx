import { NextIntlClientProvider } from "next-intl"
import { PropsWithChildren } from "react"
import { AccountProvider } from "./AccountProvider"
import { AccountType } from "app/_enteties/account"

interface Props {
	account: AccountType | null
}

export const Providers = ({
	children,
	account
}: PropsWithChildren<Props>) => {
	return (
		<NextIntlClientProvider>
			<AccountProvider account={account}>
				{children}
			</AccountProvider>
		</NextIntlClientProvider>
	)
}
