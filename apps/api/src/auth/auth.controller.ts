import { ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Req, Res, Get, Query, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { ApiSignup, ApiLogin, ApiForgotPassword, ApiResetPassword, ApiVerifyEmail, ApiResendVerificationEmail } from './auth.swagger'
import type { SignupRequest, LoginRequest } from '@medi-track/types'
import type { JwtPayload } from '../common/types/jwt'

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

  @Get('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiVerifyEmail()
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiResendVerificationEmail()
  resendVerification(@CurrentUser() user: JwtPayload) {
    return this.authService.resendVerificationEmail(user.sub)
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
