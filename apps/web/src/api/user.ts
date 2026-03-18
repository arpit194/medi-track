import { client } from './client'

export type User = {
  id: string
  name: string
  email: string
  dob: string
  bloodType: string
  gender: string
  createdAt: string
}

export type UpdateProfileInput = {
  dob: string
  bloodType: string
  gender: string
}

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

export async function getUser(): Promise<User> {
  const { data } = await client.get<User>('/user/me')
  return data
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const { data } = await client.patch<User>('/user/profile', input)
  return data
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await client.post('/user/change-password', input)
}

export async function deleteAccount(): Promise<void> {
  await client.delete('/user')
}
