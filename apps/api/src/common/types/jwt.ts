import type { UserRole } from '@medi-track/types'

export type JwtPayload = {
  sub: string
  email: string
  role: UserRole
}
