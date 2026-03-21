import type { User, UpdateProfileRequest, ChangePasswordRequest } from '@medi-track/types'
import { client } from './client'

export async function getUser(): Promise<User> {
  const { data } = await client.get<User>('/user/me')
  return data
}

export async function updateProfile(input: UpdateProfileRequest): Promise<User> {
  const { data } = await client.patch<User>('/user/profile', input)
  return data
}

export async function changePassword(input: ChangePasswordRequest): Promise<void> {
  await client.post('/user/change-password', input)
}

export async function deleteAccount(): Promise<void> {
  await client.delete('/user')
}
