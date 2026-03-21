import type { User, UserRole } from '@medi-track/types'

type UserRecord = {
  id: string
  name: string
  email: string
  dob: string | null
  bloodType: string | null
  gender: string | null
  role: UserRole
  isOnboarded: boolean
  emailVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date | null
}

export function toUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    dob: record.dob,
    bloodType: record.bloodType,
    gender: record.gender,
    role: record.role,
    isOnboarded: record.isOnboarded,
    emailVerifiedAt: record.emailVerifiedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    lastLoginAt: record.lastLoginAt?.toISOString() ?? null,
  }
}
