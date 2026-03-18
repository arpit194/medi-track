import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ShareService, type CreateShareLinkInput } from './share.service'

// TODO: replace with real user id from JWT guard
const STUB_USER_ID = 'user-id-from-jwt'

@ApiTags('share')
@ApiBearerAuth()
@Controller()
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get('share')
  listShareLinks() {
    return this.shareService.listShareLinks(STUB_USER_ID)
  }

  @Post('share')
  createShareLink(@Body() body: CreateShareLinkInput) {
    return this.shareService.createShareLink(STUB_USER_ID, body)
  }

  @Delete('share/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeShareLink(@Param('id') id: string) {
    return this.shareService.revokeShareLink(STUB_USER_ID, id)
  }

  // Public route — no auth required
  @Get('s/:token')
  getPublicShareView(@Param('token') token: string) {
    return this.shareService.getPublicShareView(token)
  }
}
