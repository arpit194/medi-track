import type { UpdateProfileInput, ChangePasswordInput, User } from '#/api/user'
import { delay } from './_utils'

const MOCK_USER: User = {
  id: 'mock-user-1',
  name: 'Test User',
  email: 'test@example.com',
  dob: '1990-06-15',
  bloodType: 'O+',
  gender: 'prefer_not_to_say',
  createdAt: '2024-01-10T08:00:00Z',
}

export async function getUser(): Promise<User> {
  await delay()
  return { ...MOCK_USER }
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  await delay()
  return { ...MOCK_USER, ...input }
}

export async function changePassword(_input: ChangePasswordInput): Promise<void> {
  await delay()
}

export async function deleteAccount(): Promise<void> {
  await delay()
}
