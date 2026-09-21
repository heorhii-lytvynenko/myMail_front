export interface MediaType {
  id: number
  url: string
  mimeType: string
  createdAt: string
  width?: number | null
  height?: number | null
  durationSeconds?: number | null
}
