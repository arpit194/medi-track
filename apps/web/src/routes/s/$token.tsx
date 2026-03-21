import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SharedReportPage } from '#/components/app/share/SharedReportPage'

const searchSchema = z.object({
  type: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const Route = createFileRoute('/s/$token')({
  validateSearch: searchSchema,
  component: SharedReportPage,
})
