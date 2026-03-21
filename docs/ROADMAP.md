# MediTrack — Roadmap

Items are grouped by theme. Check off items as they are completed.

---

## POC (complete)

- [x] Email/password auth with JWT access tokens (1h) + HttpOnly cookie refresh tokens (30d)
- [x] Forgot password / reset password (token logged to console — email TBD)
- [x] Onboarding flow (name, DOB, blood type, gender)
- [x] Upload medical reports with file attachments (UploadThing)
- [x] Edit and delete reports
- [x] Reports list with type, date range, sort, and pagination filters
- [x] Report detail view with file download
- [x] Timeline view grouped by year and month
- [x] Share links — create, revoke, reactivate
- [x] Share link expiry options: 24h, 7d, 30d, one-time (90-day safety expiry, auto-revoked on first view)
- [x] Public shared report view (`/s/:token`) — no account required
- [x] Swagger API documentation
- [x] Basic PWA setup (installable via browser, service worker caching)

---

## Internationalisation (i18n)

- [x] Set up i18n framework (react-i18next + i18next-browser-languagedetector)
- [x] Extract all UI strings to translation files
- [x] English (default)
- [x] Hindi
- [ ] Gujarati
- [ ] Tamil
- [ ] Telugu
- [ ] Bengali
- [ ] Marathi
- [ ] Kannada
- [ ] Malayalam
- [ ] Punjabi
- [ ] RTL layout support (for Urdu if added later)

---

## Auth & accounts

- [x] Email sending for password reset (Resend, verified domain medi-track.arpit194.in)
- [ ] Email verification on signup
- [ ] Google / Apple sign-in (OAuth)
- [ ] Account deletion with data export
- [ ] Login activity / session management (view and revoke active sessions)

---

## Reports

- [ ] Handwritten prescription OCR — extract structured data from uploaded images
- [ ] Bulk upload (multiple files in one go)
- [ ] Report tagging / custom labels beyond the current type system
- [ ] Condition grouping — link related reports to a named condition (e.g. "Diabetes 2023–")
- [ ] Report search by keyword across title, doctor name, and notes
- [ ] Lab value extraction and trend graphs (e.g. track HbA1c over time)

---

## Sharing

- [ ] Share link analytics — show owner when/how many times a link was viewed
- [ ] Password-protected share links (optional extra layer)
- [ ] Direct share to a registered doctor account (without public link)

---

## Family management

- [ ] Add family member profiles under one account
- [ ] Switch between family member records in the app
- [ ] Carer mode — a family member can manage another person's account with their permission
- [ ] Child health profiles with vaccination and growth tracking

---

## ABDM / ABHA integration

- [ ] ABHA ID creation within MediTrack
- [ ] Link existing ABHA ID to MediTrack account
- [ ] Pull records from ABHA-connected hospitals and labs automatically
- [ ] Register MediTrack as a Health Information Repository (HIR) so records flow both ways
- [ ] Consent management — grant / revoke access per the ABDM consent framework

---

## Notifications

- [ ] Push notifications (PWA) — e.g. when a shared link is viewed
- [ ] Email notifications — share link viewed, link about to expire
- [ ] Medication and follow-up appointment reminders

---

## Offline / PWA

- [ ] Offline read mode — previously viewed reports accessible without network
- [ ] Offline upload queue — queue uploads locally and sync when back online
- [ ] Downloadable emergency summary — critical info (blood type, conditions, medications) as a PDF that works without internet
- [ ] Background sync — queued actions (uploads, edits) sync automatically when connectivity returns

---

## Insurance

- [ ] Insurance profile — store policy details, insurer contact, TPA info
- [ ] Claim document packager — assemble the right set of documents (discharge summary, bills, reports) for a specific claim
- [ ] Pre-authorisation document checklist

---

## Doctor / provider side

- [ ] Doctor account type — separate role with different permissions
- [ ] Patients can share directly to a doctor's MediTrack account
- [ ] Doctor can leave comments or annotations on shared reports
- [ ] Doctor can push prescriptions and notes directly to a patient's record

---

## Platform

- [ ] Native mobile app (React Native) — iOS and Android
- [ ] Desktop app (Electron or Tauri) — for users who prefer managing records on a computer
- [ ] Integration with Apple Health / Google Health Connect for vitals and wearable data
- [ ] FHIR integration — import/export records in HL7 FHIR format for interoperability with hospital systems
