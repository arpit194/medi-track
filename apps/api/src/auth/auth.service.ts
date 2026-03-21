import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import type { Response, Request } from 'express'
import type { AuthResponse, User } from '@medi-track/types'
import type { JwtPayload } from '../common/types/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from '../email/email.service'
import { toUser } from '../common/utils/user.utils'

const REFRESH_COOKIE = 'mt_refresh_token'
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
    private readonly config: ConfigService,
    @Inject('REFRESH_JWT') private readonly refreshJwt: JwtService,
  ) {}

  async signup(name: string, email: string, password: string, res: Response): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictException('An account with this email already exists.')

    const hashed = await bcrypt.hash(password, 12)
    const record = await this.prisma.user.create({
      data: { name, email, password: hashed },
    })

    const user = toUser(record)
    this.setRefreshCookie(res, user)
    return { user, token: this.signAccessToken(user) }
  }

  async login(email: string, password: string, res: Response): Promise<AuthResponse> {
    const record = await this.prisma.user.findUnique({ where: { email, deletedAt: null } })
    if (!record) throw new UnauthorizedException('Invalid email or password.')

    const valid = await bcrypt.compare(password, record.password)
    if (!valid) throw new UnauthorizedException('Invalid email or password.')

    await this.prisma.user.update({
      where: { id: record.id },
      data: { lastLoginAt: new Date() },
    })

    const user = toUser(record)
    this.setRefreshCookie(res, user)
    return { user, token: this.signAccessToken(user) }
  }

  async refresh(req: Request, res: Response): Promise<{ token: string }> {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined

    if (!token) throw new UnauthorizedException('No refresh token.')

    let payload: JwtPayload
    try {
      payload = this.refreshJwt.verify<JwtPayload>(token)
    } catch {
      throw new UnauthorizedException('Invalid or expired session. Please log in again.')
    }

    const record = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
    })

    if (!record) throw new UnauthorizedException('Account not found or has been deleted.')

    const user = toUser(record)
    this.setRefreshCookie(res, user)
    return { token: this.signAccessToken(user) }
  }

  logout(res: Response): void {
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email, deletedAt: null } })

    // Silently return if email not found — don't reveal whether the account exists
    if (!user) return

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    })

    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL').split(',')[0]
    const resetLink = `${frontendUrl}/reset-password?token=${token}`
    await this.email.sendPasswordReset(user.email, user.name, resetLink)
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('This reset link is invalid or has expired. Please request a new one.')
    }

    const hashed = await bcrypt.hash(password, 12)

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
      this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ])
  }

  private signAccessToken(user: User): string {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role })
  }

  private setRefreshCookie(res: Response, user: User): void {
    const refreshToken = this.refreshJwt.sign({ sub: user.id, email: user.email, role: user.role })
    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: REFRESH_COOKIE_MAX_AGE,
    })
  }
}
