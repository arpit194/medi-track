import { createFileRoute } from '@tanstack/react-router'
import { EditReportPage } from '#/components/app/reports/EditReportPage'

export const Route = createFileRoute('/_app/reports/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <EditReportPage id={id} />
}
