import { ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto'
import { ApiSignup, ApiLogin, ApiForgotPassword, ApiResetPassword } from './auth.swagger'
import type { SignupRequest, LoginRequest } from '@medi-track/types'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignupDto))
  @ApiSignup()
  signup(@Body() body: SignupRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.signup(body.name, body.email, body.password, res)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginDto))
  @ApiLogin()
  login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(body.email, body.password, res)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res)
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiForgotPassword()
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResetPassword()
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password)
  }
}
