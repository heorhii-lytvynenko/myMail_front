import { z } from 'zod'

export const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'
export const googleAuthorizationSchema = z.object({
  authorizationUrl: z.url(),
  state: z.string().regex(/^[A-Za-z0-9_-]{43,128}$/),
  expiresIn: z.number().int().min(1).max(600),
})

const connectedAccount = z.object({
  email: z.email(),
  scopes: z.array(z.string()).refine(scopes => scopes.length === 1 && scopes[0] === GMAIL_SCOPE),
})

export const googleStatusSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('disconnected') }),
  connectedAccount.extend({ status: z.literal('connected') }),
  z.object({ status: z.literal('reconnect_required'), email: z.email(), scopes: z.array(z.literal(GMAIL_SCOPE)).max(1) }),
])
export const googleCompletionSchema = connectedAccount.extend({ status: z.literal('connected') })
export type GoogleStatus = z.infer<typeof googleStatusSchema>
