import { useQuery } from '@tanstack/react-query'
import { mediaApi } from '../api'
import { mediaKeys } from '../keys'

export const useGetMedia = (id: number) => {
  const query = useQuery({
    queryKey: mediaKeys.detail(id),
    queryFn: async () => {
      const { data } = await mediaApi.getById(id)

      return data
    }
  })

  return query
}
