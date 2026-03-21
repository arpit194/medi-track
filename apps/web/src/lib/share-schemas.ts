import { z } from 'zod'

export const createShareLinkSchema = z.object({
  label: z.string().min(1, 'Please enter a name for this link.'),
  expiresIn: z.enum(['24h', '7d', '30d', 'one_time'], {
    message: 'Please select how long the link should be valid.',
  }),
  reportIds: z.array(z.string()).min(1, 'Please select at least one report to share.'),
})
