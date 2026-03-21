import { z } from 'zod'

export const UserRoleSchema = z.enum(['patient', 'admin'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  dob: z.string().nullable(),
  bloodType: z.string().nullable(),
  gender: z.string().nullable(),
  role: UserRoleSchema,
  isOnboarded: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().nullable(),
})
export type User = z.infer<typeof UserSchema>

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

// ---- Request types ----

export type SignupRequest = {
  name: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type UpdateProfileRequest = {
  name: string
  dob: string
  bloodType: string
  gender: string
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}
