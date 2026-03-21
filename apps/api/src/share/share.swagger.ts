import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'

const shareLinkSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '019d02c7-1c48-7629-a77d-c35dd6e4bc2a' },
    userId: { type: 'string', example: '019d02c7-1c48-7629-a77d-c35dd6e4bc2a' },
    reportIds: { type: 'array', items: { type: 'string' }, example: ['id1', 'id2'] },
    label: { type: 'string', example: 'For Dr. Smith' },
    token: { type: 'string', example: 'a1b2c3d4e5f6...' },
    expiresIn: { type: 'string', enum: ['24h', '7d', '30d', 'one_time'], example: '7d' },
    expiresAt: { type: 'string', format: 'date-time' },
    isRevoked: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const reportFileSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', example: 'blood-test.pdf' },
    url: { type: 'string', example: 'https://uploadthing.com/f/...' },
    size: { type: 'number', example: 204800 },
  },
}

const reportSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string', enum: ['blood_test', 'xray', 'prescription', 'scan', 'other'] },
    title: { type: 'string', example: 'Annual blood panel' },
    date: { type: 'string', format: 'date', example: '2025-06-15' },
    doctorName: { type: 'string', example: 'Dr. Smith' },
    notes: { type: 'string', nullable: true },
    files: { type: 'array', items: reportFileSchema },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const publicShareViewSchema = {
  type: 'object',
  properties: {
    label: { type: 'string', example: 'For Dr. Smith' },
    expiresAt: { type: 'string', format: 'date-time' },
    reports: { type: 'array', items: reportSchema },
  },
}

export function ApiListShareLinks() {
  return applyDecorators(
    ApiOperation({ summary: 'List all share links for the authenticated user' }),
    ApiOkResponse({ description: 'List of share links.', schema: { type: 'array', items: shareLinkSchema } }),
    ApiUnauthorizedResponse({ description: 'Not authenticated.' }),
  )
}

export function ApiCreateShareLink() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new share link',
      description: 'Creates a tokenised link that allows public read-only access to the specified reports for the given duration. `one_time` links are automatically revoked after the first view.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['reportIds', 'label', 'expiresIn'],
        properties: {
          reportIds: { type: 'array', items: { type: 'string' }, minItems: 1, example: ['id1', 'id2'] },
          label: { type: 'string', example: 'For Dr. Smith' },
          expiresIn: { type: 'string', enum: ['24h', '7d', '30d', 'one_time'], example: '7d' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Share link created.', schema: shareLinkSchema }),
    ApiBadRequestResponse({ description: 'Validation failed or a report ID does not belong to the user.' }),
    ApiUnauthorizedResponse({ description: 'Not authenticated.' }),
  )
}

export function ApiReactivateShareLink() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reactivate an expired or revoked share link',
      description: 'Sets a new expiry from now and clears the revoked flag, making the link active again.',
    }),
    ApiParam({ name: 'id', description: 'Share link ID' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['expiresIn'],
        properties: {
          expiresIn: { type: 'string', enum: ['24h', '7d', '30d', 'one_time'], example: '7d' },
        },
      },
    }),
    ApiOkResponse({ description: 'Share link reactivated.', schema: shareLinkSchema }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Not authenticated.' }),
    ApiNotFoundResponse({ description: 'Share link not found.' }),
    ApiForbiddenResponse({ description: 'The share link belongs to a different user.' }),
  )
}

export function ApiRevokeShareLink() {
  return applyDecorators(
    ApiOperation({
      summary: 'Revoke a share link',
      description: 'Marks the link as revoked. The link can be reactivated later. This does not delete the link.',
    }),
    ApiParam({ name: 'id', description: 'Share link ID' }),
    ApiNoContentResponse({ description: 'Share link revoked.' }),
    ApiUnauthorizedResponse({ description: 'Not authenticated.' }),
    ApiNotFoundResponse({ description: 'Share link not found.' }),
    ApiForbiddenResponse({ description: 'The share link belongs to a different user.' }),
  )
}

export function ApiGetPublicShareView() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get the public view for a share link',
      description: 'Returns the label, expiry, and all shared reports for the given token. No authentication required. `one_time` links are automatically revoked after this call.',
    }),
    ApiParam({ name: 'token', description: 'Share link token' }),
    ApiOkResponse({ description: 'Share view data.', schema: publicShareViewSchema }),
    ApiNotFoundResponse({ description: 'Token not found, expired, or revoked.' }),
  )
}
