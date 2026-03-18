import { createFileRoute } from '@tanstack/react-router'
import { ReportDetailPage } from '#/components/app/reports/ReportDetailPage'

export const Route = createFileRoute('/_app/reports/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <ReportDetailPage id={id} />
}
