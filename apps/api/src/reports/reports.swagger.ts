import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConsumes,
} from '@nestjs/swagger'

const reportFileSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    key: { type: 'string' },
    url: { type: 'string' },
    name: { type: 'string' },
    size: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const reportSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    type: { type: 'string', example: 'Blood Test' },
    title: { type: 'string', example: 'Annual blood panel' },
    date: { type: 'string', example: '2024-11-10' },
    doctorName: { type: 'string', example: 'Dr. Priya Mehta' },
    notes: { type: 'string', nullable: true },
    files: { type: 'array', items: reportFileSchema },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

export function ApiGetReportFilters() {
  return applyDecorators(
    ApiOperation({ summary: 'Get available filter values for the current user\'s reports' }),
    ApiOkResponse({
      description: 'Filter metadata.',
      schema: {
        type: 'object',
        properties: {
          types: { type: 'array', items: { type: 'string' } },
          dateRange: {
            type: 'object',
            properties: {
              min: { type: 'string', nullable: true, example: '2022-01-15' },
              max: { type: 'string', nullable: true, example: '2025-11-10' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
  )
}

export function ApiListReports() {
  return applyDecorators(
    ApiOperation({ summary: 'List reports for the current user' }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'type', required: false, type: String, example: 'Blood Test' }),
    ApiQuery({ name: 'dateFrom', required: false, type: String, example: '2024-01-01' }),
    ApiQuery({ name: 'dateTo', required: false, type: String, example: '2024-12-31' }),
    ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    ApiOkResponse({
      description: 'Paginated list of reports.',
      schema: {
        type: 'object',
        properties: {
          data: { type: 'array', items: reportSchema },
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
  )
}

export function ApiGetReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single report by ID' }),
    ApiParam({ name: 'id', type: String }),
    ApiOkResponse({ description: 'Report found.', schema: reportSchema }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
    ApiForbiddenResponse({ description: 'Report belongs to another user.' }),
    ApiNotFoundResponse({ description: 'Report not found.' }),
  )
}

export function ApiCreateReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a report and upload its file' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file', 'type', 'title', 'date', 'doctorName'],
        properties: {
          file: { type: 'string', format: 'binary' },
          type: { type: 'string', example: 'Blood Test' },
          title: { type: 'string', example: 'Annual blood panel' },
          date: { type: 'string', example: '2024-11-10' },
          doctorName: { type: 'string', example: 'Dr. Priya Mehta' },
          notes: { type: 'string' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Report created.', schema: reportSchema }),
    ApiBadRequestResponse({ description: 'Validation failed or file missing.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
  )
}

export function ApiReplaceReportFile() {
  return applyDecorators(
    ApiOperation({ summary: 'Replace the file attached to a report' }),
    ApiParam({ name: 'id', type: String }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: { file: { type: 'string', format: 'binary' } },
      },
    }),
    ApiOkResponse({ description: 'Report with replaced file.', schema: reportSchema }),
    ApiBadRequestResponse({ description: 'File missing.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
    ApiForbiddenResponse({ description: 'Report belongs to another user.' }),
    ApiNotFoundResponse({ description: 'Report not found.' }),
  )
}

export function ApiUpdateReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Update report fields' }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
          date: { type: 'string' },
          doctorName: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    }),
    ApiOkResponse({ description: 'Updated report.', schema: reportSchema }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
    ApiForbiddenResponse({ description: 'Report belongs to another user.' }),
    ApiNotFoundResponse({ description: 'Report not found.' }),
  )
}

export function ApiDeleteReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete a report' }),
    ApiParam({ name: 'id', type: String }),
    ApiNoContentResponse({ description: 'Report deleted.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token.' }),
    ApiForbiddenResponse({ description: 'Report belongs to another user.' }),
    ApiNotFoundResponse({ description: 'Report not found.' }),
  )
}
