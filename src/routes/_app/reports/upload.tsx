import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports/upload')({ component: UploadReportPage })

function UploadReportPage() {
  return <div>Upload Report</div>
}
