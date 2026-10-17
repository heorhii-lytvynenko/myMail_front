import { useCookies as useReactCookies } from 'react-cookie'

export const useCookies = <T extends string>(keys: T[]) => {
	const cookies = useReactCookies<T, { [K in T]: string | undefined }>(keys)

	return cookies
}
