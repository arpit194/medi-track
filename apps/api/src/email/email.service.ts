import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { passwordResetHtml } from './templates/password-reset.template'
import { emailVerificationHtml } from './templates/email-verification.template'
import { shareLinkInviteHtml } from './templates/share-link-invite.template'

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

  async sendEmailVerification(to: string, name: string, verifyLink: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `MediTrack <${this.from}>`,
      to,
      subject: 'Verify your MediTrack email',
      html: emailVerificationHtml(name, verifyLink),
    })
    if (error) {
      this.logger.error(`Failed to send verification email to ${to}: ${error.message}`)
    }
  }

  async sendShareLinkInvite(to: string, senderName: string, shareUrl: string, accessCode: string, label: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: `MediTrack <${this.from}>`,
      to,
      subject: `${senderName} shared medical records with you`,
      html: shareLinkInviteHtml(senderName, label, shareUrl, accessCode),
    })
    if (error) {
      this.logger.error(`Failed to send share link invite to ${to}: ${error.message}`)
    }
  }
}

