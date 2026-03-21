import type { User, UpdateProfileRequest, ChangePasswordRequest } from '@medi-track/types'
import { delay } from './_utils'

const MOCK_USER: User = {
  id: 'mock-user-1',
  name: 'Test User',
  email: 'test@example.com',
  dob: '1990-06-15',
  bloodType: 'O+',
  gender: 'prefer_not_to_say',
  role: 'patient',
  isOnboarded: true,
  emailVerifiedAt: '2024-01-10T08:00:00Z',
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-10T08:00:00Z',
  lastLoginAt: null,
}

export async function getUser(): Promise<User> {
  await delay()
  return { ...MOCK_USER }
}

export async function updateProfile(input: UpdateProfileRequest): Promise<User> {
  await delay()
  return { ...MOCK_USER, ...input, isOnboarded: true }
}

export async function changePassword(_input: ChangePasswordRequest): Promise<void> {
  await delay()
}

export async function deleteAccount(): Promise<void> {
  await delay()
}
