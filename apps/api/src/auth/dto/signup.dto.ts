import { z } from 'zod'
import type { SignupRequest } from '@medi-track/types'

export const SignupDto: z.ZodType<SignupRequest> = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})
