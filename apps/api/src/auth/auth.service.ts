import { Injectable } from '@nestjs/common'
import type { User } from '@medi-track/types'

export type AuthResponse = { user: User; token: string }

@Injectable()
export class AuthService {
  async login(_email: string, _password: string): Promise<AuthResponse> {
    throw new Error('Not implemented')
  }

  async signup(_name: string, _email: string, _password: string): Promise<AuthResponse> {
    throw new Error('Not implemented')
  }

  async forgotPassword(_email: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async resetPassword(_token: string, _password: string): Promise<void> {
    throw new Error('Not implemented')
  }
}
