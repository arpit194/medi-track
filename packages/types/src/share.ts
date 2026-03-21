import { z } from 'zod'
import { ReportSchema } from './report'

export const ShareLinkExpiryOptionSchema = z.enum(['24h', '7d', '30d', 'one_time'])
export type ShareLinkExpiryOption = z.infer<typeof ShareLinkExpiryOptionSchema>

export const ShareLinkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  reportIds: z.array(z.string()),
  label: z.string(),
  token: z.string(),
  expiresIn: ShareLinkExpiryOptionSchema,
  expiresAt: z.string(),
  isRevoked: z.boolean(),
  createdAt: z.string(),
})
export type ShareLink = z.infer<typeof ShareLinkSchema>

export const PublicShareViewSchema = z.object({
  label: z.string(),
  expiresAt: z.string(),
  reports: z.array(ReportSchema),
})
export type PublicShareView = z.infer<typeof PublicShareViewSchema>

// ---- Request types ----

export type CreateShareLinkRequest = {
  reportIds: string[]
  label: string
  expiresIn: ShareLinkExpiryOption
}
