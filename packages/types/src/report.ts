import { z } from 'zod'

export const ReportFileSchema = z.object({
  id: z.string(),
  key: z.string(),
  url: z.string(),
  name: z.string(),
  size: z.number(),
  createdAt: z.string(),
})
export type ReportFile = z.infer<typeof ReportFileSchema>

export const ReportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  date: z.string(),
  doctorName: z.string(),
  notes: z.string().nullable(),
  files: z.array(ReportFileSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Report = z.infer<typeof ReportSchema>

export const PaginatedReportsSchema = z.object({
  data: z.array(ReportSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})
export type PaginatedReports = z.infer<typeof PaginatedReportsSchema>

export const ReportFiltersSchema = z.object({
  types: z.array(z.string()),
  dateRange: z.object({
    min: z.string().nullable(),
    max: z.string().nullable(),
  }),
})
export type ReportFilters = z.infer<typeof ReportFiltersSchema>

// ---- Request types ----

export type CreateReportRequest = {
  type: string
  title: string
  date: string
  doctorName: string
  notes?: string
}

export type UpdateReportRequest = Partial<CreateReportRequest>

export type ListReportsQuery = {
  page?: number
  limit?: number
  type?: string
  dateFrom?: string
  dateTo?: string
  sortOrder?: 'asc' | 'desc'
}
