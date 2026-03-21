import type { AuthResponse, SignupRequest, LoginRequest } from '@medi-track/types'
import { client } from './client'

export type ForgotPasswordInput = { email: string }
export type ResetPasswordInput = { token: string; password: string }

export async function signup(input: SignupRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/signup', input)
  return data
}

export async function login(input: LoginRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', input)
  return data
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  await client.post('/auth/forgot-password', input)
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await client.post('/auth/reset-password', input)
}

export async function verifyEmail(token: string): Promise<void> {
  await client.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
}

export async function resendVerificationEmail(): Promise<void> {
  await client.post('/auth/resend-verification')
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout')
}
