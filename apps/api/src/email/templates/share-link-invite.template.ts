export function shareLinkInviteHtml(senderName: string, label: string, shareUrl: string, accessCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Medical records shared with you</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid #f3f4f6;">
              <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">MediTrack</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#111827;">Medical records shared with you</p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                <strong style="color:#374151;">${senderName}</strong> has shared <strong style="color:#374151;">${label}</strong> with you via MediTrack.
              </p>

              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Access code</p>
                <p style="margin:0;font-size:32px;font-weight:700;color:#111827;letter-spacing:0.15em;font-family:monospace;">${accessCode}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">You'll need this code to view the reports.</p>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${shareUrl}" style="display:inline-block;background:#0d9488;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">View shared reports</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                Or copy this link into your browser:<br />
                <span style="color:#0d9488;word-break:break-all;">${shareUrl}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                This link was shared via MediTrack. If you were not expecting this, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
