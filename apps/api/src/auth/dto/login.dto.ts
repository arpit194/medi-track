import { z } from 'zod'
import type { LoginRequest } from '@medi-track/types'

export const LoginDto: z.ZodType<LoginRequest> = z.object({
  email: z.email(),
  password: z.string().min(1),
})
