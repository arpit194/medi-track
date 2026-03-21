import { z } from 'zod'
import type { ChangePasswordRequest } from '@medi-track/types'

export const ChangePasswordDto: z.ZodType<ChangePasswordRequest> = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})
