import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports/$id/edit')({ component: EditReportPage })

function EditReportPage() {
  return <div>Edit Report</div>
}
