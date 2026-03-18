import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/timeline')({ component: TimelinePage })

function TimelinePage() {
  return <div>Timeline</div>
}
