import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReportsPage } from '#/components/app/reports/ReportsPage'

const reportsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  type: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const Route = createFileRoute('/_app/reports/')({
  validateSearch: reportsSearchSchema,
  component: ReportsPage,
})
