import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { ListReportsDto } from './dto/list-reports.dto'
import { ApiGetReportFilters, ApiListReports, ApiGetReport, ApiCreateReport, ApiReplaceReportFile, ApiUpdateReport, ApiDeleteReport } from './reports.swagger'
import type { JwtPayload } from '../common/types/jwt'
import type { CreateReportRequest, UpdateReportRequest, ListReportsQuery } from '@medi-track/types'

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('filters')
  @ApiGetReportFilters()
  getReportFilters(@CurrentUser() user: JwtPayload) {
    return this.reportsService.getReportFilters(user.sub)
  }

  @Get()
  @ApiListReports()
  listReports(
    @CurrentUser() user: JwtPayload,
    @Query(new ZodValidationPipe(ListReportsDto)) query: ListReportsQuery,
  ) {
    return this.reportsService.listReports(user.sub, query)
  }

  @Get(':id')
  @ApiGetReport()
  getReport(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.reportsService.getReport(user.sub, id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreateReport()
  createReport(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(CreateReportDto)) body: CreateReportRequest,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) throw new BadRequestException('A file is required.')
    return this.reportsService.createReport(user.sub, body, file)
  }

  @Put(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiReplaceReportFile()
  replaceReportFile(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) throw new BadRequestException('A file is required.')
    return this.reportsService.replaceReportFile(user.sub, id, file)
  }

  @Patch(':id')
  @ApiUpdateReport()
  updateReport(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateReportDto)) body: UpdateReportRequest,
  ) {
    return this.reportsService.updateReport(user.sub, id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteReport()
  deleteReport(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.reportsService.deleteReport(user.sub, id)
  }
}
