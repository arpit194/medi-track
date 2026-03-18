import { client } from './client'

// --- Input / response types ---

type User = {
  id: string
  name: string
  email: string
  dob: string
  bloodType: string
  gender: string
  createdAt: string
}

export type LoginInput = {
  email: string
  password: string
}

export type SignupInput = {
  name: string
  email: string
  password: string
}

export type ForgotPasswordInput = {
  email: string
}

export type ResetPasswordInput = {
  token: string
  password: string
}

export type AuthResponse = {
  user: User
  token: string
}

// --- API functions ---

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', input)
  return data
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/signup', input)
  return data
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<void> {
  await client.post('/auth/forgot-password', input)
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<void> {
  await client.post('/auth/reset-password', input)
}
