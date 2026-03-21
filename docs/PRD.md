# MediTrack — Product Requirements Document

## Problem

Patients accumulate medical reports over time — blood tests, X-rays, prescriptions, scans — and typically store them in physical folders or scattered across emails and apps. When visiting a new doctor or specialist, they need to bring the right documents, in the right order, and hope nothing gets lost.

There is no simple, unified place for a patient to store their reports digitally and share a curated subset with a doctor — without requiring the doctor to sign up for anything.

## Target users

**Primary: Patients**
- Wide age range, including elderly users with low tech comfort
- Managing their own medical records, often across multiple doctors and hospitals
- Primarily on mobile, occasionally on desktop
- May be anxious or unfamiliar with digital tools — trust and clarity are essential

**Secondary: Doctors and specialists (link recipients)**
- Receive a share link from a patient
- Need read-only access to specific reports, no account required
- May be viewing on any device, including mobile

## Design principles

These principles apply to every product and design decision:

| Principle | What it means in practice |
|---|---|
| **Clarity over cleverness** | Obvious is always better than clever. If a user has to think, we've failed. |
| **Trust** | Clean, calm aesthetic. No jargon. Feels safe to store sensitive health data. |
| **Forgiveness** | Hard to accidentally do something irreversible. Always confirm destructive actions. |
| **Mobile-first** | Designed for phones first, desktop second. Minimum 44×44px touch targets. |
| **Accessibility** | High contrast, large text, visible focus rings, never colour as the only signal. |

## POC scope (what's built)

### Authentication
- Sign up and log in with email and password
- JWT-based auth — 1-hour access tokens, 30-day HttpOnly cookie refresh tokens
- Forgot password / reset password flow (email sending is a stub — token logged to console for now)
- Onboarding flow after first sign up (name, date of birth, blood type, gender)

### Reports
- Upload medical reports with files (PDF, images), title, date, doctor name, type, and notes
- Report types: Blood test, X-ray, Prescription, Scan, Other
- Edit and delete reports (with file replacement)
- List view with filters: type, date range, sort order, pagination
- Detail view with file download links

### Timeline
- Chronological view of all reports grouped by year and month
- Filter by report type

### Share links
- Create a tokenised link sharing a subset of reports
- Expiry options: 24 hours, 7 days, 30 days, One-time view (90-day safety expiry, auto-revoked on first view)
- Revoke an active link at any time
- Reactivate an expired or revoked link with a new expiry
- Public view at `/s/:token` — no account required, shows reports in timeline format with type and date filters
- Active and expired/revoked links shown in separate tabs

## Roadmap (planned)

### Near term
- Email sending for password reset (integrate a mail provider, e.g. Resend)
- Push or email notifications (e.g. when a shared link is viewed)
- Profile photo upload

### Medium term
- Doctor user role — doctors can have accounts, patients can share directly to a doctor rather than via a public link
- Report comments — doctors can leave notes on shared reports
- Multiple patient profiles — a carer managing reports for a family member

### Longer term
- Mobile app (React Native)
- OCR / data extraction from uploaded reports
- Integration with health record standards (e.g. FHIR)
- Audit log — patients can see when and how their data has been accessed
