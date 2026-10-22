import { z } from 'zod'

export const credentialSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  password: z.string().min(1).max(1024),
})

export const registrationSchema = credentialSchema.extend({
  password: z.string().min(8).max(1024),
  confirmPassword: z.string(),
}).refine(value => value.password === value.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match.',
})

export const currentUserSchema = z.object({
  email: z.email(),
  idpId: z.string().min(1),
})

export const tokenResponseSchema = z.object({
  accessToken: z.string().min(1).regex(/^[A-Za-z0-9._~+/-]+=*$/)
    .refine(token => encodeURIComponent(token).length <= 3800),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive().optional(),
})

export type CurrentUser = z.infer<typeof currentUserSchema>
