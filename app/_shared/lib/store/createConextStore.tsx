import type { FC, PropsWithChildren } from 'react'
import { createContext, use, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'

type Initilizer<T, F> = (
	initialData: F,
	set: (state: Partial<T> | ((prev: T) => Partial<T>)) => void,
	get: () => T,
	api: StoreApi<T>
) => T

export const createConextStore = <T, F = Record<string, any>>(
	initializer: Initilizer<T, F>
) => {
	const Context = createContext<StoreApi<T> | undefined>(undefined)

	const useContextStore = <F,>(selector: (state: T) => F) => {
		const context = use(Context)

		if (!context)
			throw new Error('useContextStore must be used within a Provider')

		return useStore(context, selector)
	}

	const Provider: FC<PropsWithChildren & F> = ({ children, ...rest }) => {
		const [store] = useState(() =>
			createStore<T>((...asr) => initializer(rest as F, ...asr))
		)

		return <Context.Provider value={store}>{children}</Context.Provider>
	}

	return [Provider, useContextStore, Context] as const
}
