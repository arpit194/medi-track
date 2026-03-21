import { z } from 'zod'
import type { CreateReportRequest } from '@medi-track/types'

export const CreateReportDto: z.ZodType<CreateReportRequest> = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  doctorName: z.string().min(1),
  notes: z.string().optional(),
})
