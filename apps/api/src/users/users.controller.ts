import { Controller, Get, Patch, Post, Delete, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ApiGetMe, ApiUpdateProfile, ApiChangePassword, ApiDeleteAccount } from './users.swagger'
import type { JwtPayload } from '../common/types/jwt'
import type { UpdateProfileRequest, ChangePasswordRequest } from '@medi-track/types'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiGetMe()
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMe(user.sub)
  }

  @Patch('profile')
  @ApiUpdateProfile()
  updateProfile(@CurrentUser() user: JwtPayload, @Body(new ZodValidationPipe(UpdateProfileDto)) body: UpdateProfileRequest) {
    return this.usersService.updateProfile(user.sub, body)
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiChangePassword()
  changePassword(@CurrentUser() user: JwtPayload, @Body(new ZodValidationPipe(ChangePasswordDto)) body: ChangePasswordRequest) {
    return this.usersService.changePassword(user.sub, body.currentPassword, body.newPassword)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteAccount()
  deleteAccount(@CurrentUser() user: JwtPayload) {
    return this.usersService.deleteAccount(user.sub)
  }
}
