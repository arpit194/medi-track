import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { passwordResetHtml } from './templates/password-reset.template'

@Injectable()
export class EmailService {
  private readonly resend: Resend
  private readonly from: string
  private readonly logger = new Logger(EmailService.name)

  constructor(config: ConfigService) {
    this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'))
    this.from = config.getOrThrow<string>('FROM_EMAIL')
  }

  async sendPasswordReset(to: string, name: string, resetLink: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `MediTrack <${this.from}>`,
      to,
      subject: 'Reset your MediTrack password',
      html: passwordResetHtml(name, resetLink),
    })

    if (error) {
      this.logger.error(`Failed to send password reset email to ${to}: ${error.message}`)
    }
  }
}

