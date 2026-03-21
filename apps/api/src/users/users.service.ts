import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import type { User, UpdateProfileRequest } from '@medi-track/types'
import { PrismaService } from '../prisma/prisma.service'
import { toUser } from '../common/utils/user.utils'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<User> {
    const record = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } })
    if (!record) throw new NotFoundException('User not found.')
    return toUser(record)
  }

  async updateProfile(userId: string, input: UpdateProfileRequest): Promise<User> {
    const record = await this.prisma.user.update({
      where: { id: userId },
      data: { ...input, isOnboarded: true },
    })
    return toUser(record)
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const record = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } })
    if (!record) throw new NotFoundException('User not found.')

    const valid = await bcrypt.compare(currentPassword, record.password)
    if (!valid) throw new UnauthorizedException('Current password is incorrect.')

    const hashed = await bcrypt.hash(newPassword, 12)
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } })
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), deletedBy: 'self' },
    })
  }
}
