import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ShareService } from './share.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ApiListShareLinks, ApiCreateShareLink, ApiReactivateShareLink, ApiRevokeShareLink, ApiGetPublicShareView } from './share.swagger'
import type { JwtPayload } from '../common/types/jwt'
import type { CreateShareLinkRequest, ShareLinkExpiryOption } from '@medi-track/types'

@ApiTags('share')
@Controller()
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get('share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiListShareLinks()
  listShareLinks(@CurrentUser() user: JwtPayload) {
    return this.shareService.listShareLinks(user.sub)
  }

  @Post('share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreateShareLink()
  createShareLink(@CurrentUser() user: JwtPayload, @Body() body: CreateShareLinkRequest) {
    return this.shareService.createShareLink(user.sub, body)
  }

  @Patch('share/:id/reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiReactivateShareLink()
  reactivateShareLink(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { expiresIn: ShareLinkExpiryOption },
  ) {
    return this.shareService.reactivateShareLink(user.sub, id, body.expiresIn)
  }

  @Delete('share/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRevokeShareLink()
  revokeShareLink(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.shareService.revokeShareLink(user.sub, id)
  }

  // Public route — no auth required
  @Get('s/:token')
  @ApiGetPublicShareView()
  getPublicShareView(@Param('token') token: string) {
    return this.shareService.getPublicShareView(token)
  }
}
