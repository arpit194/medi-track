import { z } from 'zod'
import type { UpdateReportRequest } from '@medi-track/types'

export const UpdateReportDto: z.ZodType<UpdateReportRequest> = z.object({
  type: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  doctorName: z.string().min(1).optional(),
  notes: z.string().optional(),
})
