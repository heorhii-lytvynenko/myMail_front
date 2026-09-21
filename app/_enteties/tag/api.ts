import { publicApiClient } from '@shared/lib/config'
import type {
  GetTagListParams,
  GetTagListResponse,
  GetTagResponse
} from './types'

export const tagApi = {
  getList: (params: GetTagListParams) => {
    return publicApiClient.get<GetTagListResponse, GetTagListParams>('/tags', {
      params
    })
  },

  getById: (id: string) => {
    return publicApiClient.get<GetTagResponse>(`/tags/${id}`)
  }
}
