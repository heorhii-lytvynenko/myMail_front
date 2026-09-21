export interface PageInfoType {
  pageNumber: number
  pageSize: number
  totalPages: number
  pageElements: number
  totalElements: number
}

export type PaginatedResponse<T> = {
  page: PageInfoType
  pageElements: T[]
}

export interface TotalCountResponse {
  total: number
}
