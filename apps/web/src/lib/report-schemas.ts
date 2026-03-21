import { z } from 'zod'

export const uploadReportSchema = z.object({
  type: z.string().min(1, 'Please select a report type.'),
  title: z.string().min(1, 'Please enter a title for this report.'),
  date: z.string().min(1, 'Please enter the date shown on the report.'),
  doctorName: z.string().min(1, "Please enter the doctor's name."),
  notes: z.string(),
})

export const editReportSchema = uploadReportSchema
