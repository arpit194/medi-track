import { ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password)
  }

  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.signup(body.name, body.email, body.password)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password)
  }
}
