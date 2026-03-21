import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '019d02c7-1c48-7629-a77d-c35dd6e4bc2a' },
    name: { type: 'string', example: 'Jane Smith' },
    email: { type: 'string', example: 'jane@example.com' },
    dob: { type: 'string', nullable: true, example: '1985-06-15' },
    bloodType: { type: 'string', nullable: true, example: 'A+' },
    gender: { type: 'string', nullable: true, example: 'female' },
    role: { type: 'string', enum: ['patient', 'admin'], example: 'patient' },
    isOnboarded: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    lastLoginAt: { type: 'string', nullable: true, format: 'date-time' },
  },
}

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get the current authenticated user' }),
    ApiOkResponse({ description: 'Current user profile.', schema: userSchema }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  )
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update profile and complete onboarding',
      description: 'Updates profile fields and sets `isOnboarded: true`. Safe to call on subsequent profile edits.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['name', 'dob', 'bloodType', 'gender'],
        properties: {
          name: { type: 'string', example: 'Jane Smith' },
          dob: { type: 'string', example: '1985-06-15' },
          bloodType: { type: 'string', example: 'A+' },
          gender: { type: 'string', example: 'female' },
        },
      },
    }),
    ApiOkResponse({ description: 'Updated user profile.', schema: userSchema }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
  )
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Change the current user\'s password' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', example: 'oldpass123' },
          newPassword: { type: 'string', minLength: 8, example: 'newpass456' },
        },
      },
    }),
    ApiNoContentResponse({ description: 'Password changed successfully.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Current password is incorrect.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  )
}

export function ApiDeleteAccount() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete the current user\'s account',
      description: 'Soft-deletes the account by setting `deletedAt` and `deletedBy`. The record is retained but the user cannot log in.',
    }),
    ApiNoContentResponse({ description: 'Account deleted.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
  )
}
