import { z } from 'zod'
import type { UpdateProfileRequest } from '@medi-track/types'

export const UpdateProfileDto: z.ZodType<UpdateProfileRequest> = z.object({
  name: z.string().min(1),
  dob: z.string().min(1),
  bloodType: z.string().min(1),
  gender: z.string().min(1),
})
