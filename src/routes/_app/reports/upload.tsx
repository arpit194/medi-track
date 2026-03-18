import { createFileRoute } from '@tanstack/react-router'
import { UploadReportPage } from '#/components/app/reports/UploadReportPage'

export const Route = createFileRoute('/_app/reports/upload')({
  component: UploadReportPage,
})
