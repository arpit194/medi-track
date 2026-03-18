import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'

// TODO: replace with real user id from JWT guard
const STUB_USER_ID = 'user-id-from-jwt'

@ApiTags('users')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe() {
    return this.usersService.getMe(STUB_USER_ID)
  }

  @Patch('profile')
  updateProfile(@Body() body: { dob: string; bloodType: string; gender: string }) {
    return this.usersService.updateProfile(STUB_USER_ID, body)
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Body() body: { currentPassword: string; newPassword: string }) {
    return this.usersService.changePassword(STUB_USER_ID, body.currentPassword, body.newPassword)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAccount() {
    return this.usersService.deleteAccount(STUB_USER_ID)
  }
}
