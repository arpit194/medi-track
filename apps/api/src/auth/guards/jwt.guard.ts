import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../prisma/prisma.service'
import type { JwtPayload } from '../../common/types/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user: JwtPayload }>()
    const authHeader = request.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required.')
    }

    let payload: JwtPayload
    try {
      payload = this.jwt.verify<JwtPayload>(authHeader.slice(7))
    } catch {
      throw new UnauthorizedException('Invalid or expired session. Please log in again.')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { deletedAt: true },
    })

    if (!user || user.deletedAt !== null) {
      throw new UnauthorizedException('Account not found or has been deleted.')
    }

    request.user = payload
    return true
  }
}
