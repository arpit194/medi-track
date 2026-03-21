import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createShareSchemas(t: TFunction) {
  const createShareLinkSchema = z.object({
    label: z.string().min(1, t('validation.shareLabelRequired')),
    expiresIn: z.enum(['24h', '7d', '30d', 'one_time'], {
      message: t('validation.shareExpiryRequired'),
    }),
    reportIds: z.array(z.string()).min(1, t('validation.shareReportsRequired')),
  })

  return { createShareLinkSchema }
}
