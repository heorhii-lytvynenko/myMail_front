import { userApiClient } from '@shared/lib/config'
import type { FetchOptions, FetchParams } from '@shared/lib/utils'
import type { GetAccountResponse } from './types/response'

export const accountApi = {
	getAccount: async (options?: FetchOptions<FetchParams>) => {
		return userApiClient.get<GetAccountResponse>('/account', options)
	}
}
