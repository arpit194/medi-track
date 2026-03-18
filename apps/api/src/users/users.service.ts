import { Injectable } from '@nestjs/common'
import type { User } from '@medi-track/types'

@Injectable()
export class UsersService {
  async getMe(_userId: string): Promise<User> {
    throw new Error('Not implemented')
  }

  async updateProfile(
    _userId: string,
    _input: { dob: string; bloodType: string; gender: string },
  ): Promise<User> {
    throw new Error('Not implemented')
  }

  async changePassword(
    _userId: string,
    _currentPassword: string,
    _newPassword: string,
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  async deleteAccount(_userId: string): Promise<void> {
    throw new Error('Not implemented')
  }
}
