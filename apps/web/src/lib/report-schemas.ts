import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createReportSchemas(t: TFunction) {
  const uploadReportSchema = z.object({
    type: z.string().min(1, t('validation.reportTypeRequired')),
    title: z.string().min(1, t('validation.reportTitleRequired')),
    date: z.string().min(1, t('validation.reportDateRequired')),
    doctorName: z.string().min(1, t('validation.doctorNameRequired')),
    notes: z.string(),
  })

  const editReportSchema = uploadReportSchema

  return { uploadReportSchema, editReportSchema }
}
