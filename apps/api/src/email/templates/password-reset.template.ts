export function passwordResetHtml(name: string, resetLink: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f4f4f5; margin: 0; padding: 32px 16px;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px 32px;">
    <h1 style="font-size: 22px; color: #111827; margin: 0 0 8px;">Reset your password</h1>
    <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">Hi ${name}, we received a request to reset your MediTrack password. Click the button below to choose a new one.</p>
    <a href="${resetLink}" style="display: inline-block; background: #1a7a5e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600;">Reset password</a>
    <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
  </div>
</body>
</html>`
}
