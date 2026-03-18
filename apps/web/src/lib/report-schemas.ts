import { z } from 'zod'
import { REPORT_TYPE_VALUES } from '#/api/reports'

export const reportTypeSchema = z.enum(REPORT_TYPE_VALUES)

export const uploadReportSchema = z.object({
  type: reportTypeSchema,
  title: z.string().min(1, 'Please enter a title for this report.'),
  date: z.string().min(1, 'Please enter the date shown on the report.'),
  doctorName: z.string().min(1, "Please enter the doctor's name."),
  notes: z.string(),
})

export const editReportSchema = uploadReportSchema
