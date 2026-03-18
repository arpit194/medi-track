import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordPage } from '#/components/auth/ResetPasswordPage'

const searchSchema = z.object({
  token: z.string().catch(''),
})

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
})
