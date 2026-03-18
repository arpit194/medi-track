import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from '#/api/auth'
import { delay } from './_utils'

const MOCK_USER_BASE = {
  id: 'mock-user-1',
  dob: '1990-01-01',
  bloodType: 'O+',
  gender: 'prefer not to say',
  createdAt: new Date().toISOString(),
}

// Use this email in dev to test error handling
const ERROR_EMAIL = 'error@test.com'

export async function login(input: LoginInput): Promise<AuthResponse> {
  await delay()
  if (input.email === ERROR_EMAIL) {
    throw new Error('Incorrect email or password. Please try again.')
  }
  return {
    user: { ...MOCK_USER_BASE, name: 'Test User', email: input.email },
    token: 'mock-token',
  }
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
  await delay()
  if (input.email === ERROR_EMAIL) {
    throw new Error('An account with this email already exists.')
  }
  return {
    user: { ...MOCK_USER_BASE, name: input.name, email: input.email },
    token: 'mock-token',
  }
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<void> {
  await delay()
  if (input.email === ERROR_EMAIL) {
    throw new Error(
      "We couldn't send the reset link. Please try again later.",
    )
  }
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<void> {
  await delay()
  if (input.token === 'error-token') {
    throw new Error('This reset link is invalid or has expired. Please request a new one.')
  }
}
