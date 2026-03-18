import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { ReportsService, type UpdateReportInput } from './reports.service'
import type { ReportType } from '@medi-track/types'

// TODO: replace with real user id from JWT guard
const STUB_USER_ID = 'user-id-from-jwt'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  listReports() {
    return this.reportsService.listReports(STUB_USER_ID)
  }

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.reportsService.getReport(STUB_USER_ID, id)
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  createReport(
    @Body() body: { type: ReportType; title: string; date: string; doctorName: string; notes: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reportsService.createReport(STUB_USER_ID, { ...body, files })
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() body: UpdateReportInput) {
    return this.reportsService.updateReport(STUB_USER_ID, id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteReport(@Param('id') id: string) {
    return this.reportsService.deleteReport(STUB_USER_ID, id)
  }
}
