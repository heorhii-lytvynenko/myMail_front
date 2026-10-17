export type MediaTargetType =
  | 'post_public'
  | 'event_public'
  | 'tag_public'
  | 'account_public'
  | 'company_public'
  | 'job_offer_public'
  | 'comment_public'
  | 'job_offer_private'

export interface UploadMediaBody {
  file: File
  targetType: MediaTargetType
  targetId: number
}
