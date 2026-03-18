import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '#/components/app/profile/ProfilePage'

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
})
