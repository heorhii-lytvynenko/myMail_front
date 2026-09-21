import { userApiClient } from '@shared/lib/config'
import { toFormData } from '@shared/lib/utils'
import type {
  GetMediaByIdResponse,
  GetMediaListParams,
  GetMediaListResponse,
  UploadMediaBody,
  UploadMediaResponse
} from './types'

export const mediaApi = {
  getList: (params: GetMediaListParams) => {
    return userApiClient.get<GetMediaListResponse, GetMediaListParams>(
      '/media',
      { params }
    )
  },

  getById: (id: string | number) => {
    return userApiClient.get<GetMediaByIdResponse>(`/media/${id}`)
  },

  upload: async (body: UploadMediaBody) => {
    const formData = toFormData(body)

    return userApiClient.post<UploadMediaResponse>('/media/upload', formData)
  }
}
