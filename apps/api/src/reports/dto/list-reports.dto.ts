import { z } from 'zod'
import type { ListReportsQuery } from '@medi-track/types'

export const ListReportsDto: z.ZodType<ListReportsQuery> = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
