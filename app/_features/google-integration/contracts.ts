import { z } from 'zod'

export const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'
export const googleAuthorizationSchema = z.object({
  authorizationUrl: z.url(),
  state: z.string().regex(/^[A-Za-z0-9_-]{43,128}$/),
  expiresIn: z.number().int().min(1).max(600),
})

const connectionDetailsSchema = z.object({
  email: z.email().nullish(),
  // The backend emits null for disconnected scopes; expose that as omitted.
  scopes: z.array(z.literal(GMAIL_SCOPE)).max(1).nullable().transform(value => value ?? undefined).optional(),
})

export const googleStatusSchema = z.discriminatedUnion('status', [
  connectionDetailsSchema.extend({ status: z.literal('disconnected') }),
  connectionDetailsSchema.extend({ status: z.literal('connected') }),
  connectionDetailsSchema.extend({ status: z.literal('reconnect_required') }),
])
export const googleCompletionSchema = connectionDetailsSchema.extend({ status: z.literal('connected') })

export type GoogleStatus = z.infer<typeof googleStatusSchema>
