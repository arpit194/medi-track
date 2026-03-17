import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({ component: NotFoundPage })

function NotFoundPage() {
  return <div>404 — Not Found</div>
}
