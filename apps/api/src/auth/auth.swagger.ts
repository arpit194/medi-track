import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '019d02c7-1c48-7629-a77d-c35dd6e4bc2a' },
    name: { type: 'string', example: 'Jane Smith' },
    email: { type: 'string', example: 'jane@example.com' },
    dob: { type: 'string', nullable: true, example: null },
    bloodType: { type: 'string', nullable: true, example: null },
    gender: { type: 'string', nullable: true, example: null },
    role: { type: 'string', enum: ['patient', 'admin'], example: 'patient' },
    isOnboarded: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    lastLoginAt: { type: 'string', nullable: true, example: null },
  },
}

const authResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string', example: 'eyJhbGci...' },
    user: userSchema,
  },
}

export function ApiSignup() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new account',
      description:
        'Registers a new patient account. Returns the created user and a signed JWT token. ' +
        'The user will have `isOnboarded: false` and must complete onboarding before accessing the app.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Smith' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', minLength: 8, example: 'securepass123' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Account created.', schema: authResponseSchema }),
    ApiBadRequestResponse({ description: 'Validation failed — missing or invalid fields.' }),
    ApiConflictResponse({ description: 'An account with this email already exists.' }),
  )
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Log in to an existing account' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', example: 'securepass123' },
        },
      },
    }),
    ApiOkResponse({ description: 'Login successful.', schema: authResponseSchema }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Invalid email or password.' }),
  )
}

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request a password reset email',
      description: 'Always returns 204 regardless of whether the email exists — prevents user enumeration.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
        },
      },
    }),
    ApiNoContentResponse({ description: 'Reset email sent if account exists.' }),
  )
}

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using a token from the reset email' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string', example: 'eyJhbGci...' },
          password: { type: 'string', minLength: 8, example: 'newpass456' },
        },
      },
    }),
    ApiNoContentResponse({ description: 'Password reset successfully.' }),
    ApiUnauthorizedResponse({ description: 'Invalid or expired reset token.' }),
  )
}
