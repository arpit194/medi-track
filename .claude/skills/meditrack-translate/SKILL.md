---
name: meditrack-translate
description: Add or update translations for MediTrack. Covers translation philosophy, language-specific rules, word choices to avoid, and the review process.
argument-hint: <language code, e.g. hi, gu, ta>
---

# MediTrack — Translation Guide

## Who are the users?

Non-tech-savvy patients of all ages, including elderly people. Many are urban Indians who code-switch naturally between their native language and English. Translations must sound like how a helpful family member would explain something — not a government form, not a news anchor, not a dictionary.

## Core philosophy

**When in doubt, keep the English word written in the target script.**

Urban Indian users say "appointment", "report", "upload", "download", "password", "link", "profile", "settings", "dashboard" in everyday speech. Translating these into formal native equivalents makes the app feel unfamiliar and harder to use.

The goal is not linguistic purity. It is clarity and comfort for the user.

---

## General rules (apply to all languages)

**Keep as English (just transliterate into the script):**
- Technical/app words: upload, download, dashboard, timeline, profile, settings, link, password, email, OTP, PIN, app, login, logout, sign in, sign out
- Medical terms that are already borrowed: report, prescription, scan, X-ray, MRI, CT scan, blood test, doctor
- UI actions: edit, delete, update, save, cancel, share, copy, verify, reset
- Status words: active, expired, revoked, one-time

**Write naturally in the target language:**
- Greetings and conversational phrases
- Error messages that explain what went wrong
- Instructions that guide the user through a flow
- Confirmations ("Are you sure?", "Done!", "Sent!")

**Sentence style:**
- Short sentences. One idea per sentence.
- No passive voice if avoidable — "भेज दिया गया" is fine but "आपके द्वारा भेजा गया" is too formal
- Use contractions and informal connectors where natural
- Never use honorifics beyond what is culturally expected (आप is fine, श्रीमान is not)

---

## Hindi (hi) — specific rules

### Words to always avoid

| Avoid | Use instead | Reason |
|---|---|---|
| सत्यापन / सत्यापित | वेरिफ़िकेशन / वेरिफ़ाई | Nobody says सत्यापन in conversation |
| संपादित करें | एडिट करें | Too formal |
| अनुलग्नक | अटैचमेंट | Nobody knows this word |
| संपीड़ित | तैयार हो रहा है (or just skip) | Completely unknown to most users |
| प्राप्तकर्ता | जिसे भेजना है / पाने वाले | Government-form language |
| पुनः सक्रिय | री-एक्टिवेट | Too formal |
| शुभ प्रभात | Good Morning | Nobody says शुभ प्रभात in real life |
| शुभ संध्या | Good Evening | Same |
| रक्त समूह | ब्लड ग्रुप | People say ब्लड ग्रुप even in hospitals |
| नवीनतम | नया | नवीनतम sounds like a newspaper headline |
| पृष्ठ | पेज | पृष्ठ is from textbooks |
| प्रतीक्षा करें | थोड़ा रुकें | Natural spoken Hindi |
| पुनः प्रयास | दोबारा कोशिश करें | Natural spoken Hindi |
| चिकित्सा | मेडिकल | People say मेडिकल जानकारी, not चिकित्सा जानकारी |
| पंजीकृत | रजिस्टर | People say रजिस्टर |
| पूर्ववत | (rewrite the sentence) | Nobody knows this word — rephrase |

### Tone examples

| Too formal | Natural |
|---|---|
| कृपया प्रतीक्षा करें | थोड़ा रुकें… |
| पुनः प्रयास करें | दोबारा कोशिश करें |
| यह क्रिया पूर्ववत नहीं की जा सकती | यह वापस नहीं होगा |
| सत्यापन विफल | वेरिफ़िकेशन नहीं हो सका |
| अपना ईमेल सत्यापित करें | अपना ईमेल वेरिफ़ाई करें |

---

## Other Indian languages — general guidance

These languages have not been reviewed by a native speaker yet. Apply the same principles as Hindi:

- **Gujarati (gu):** Urban Gujarati speakers heavily borrow English app vocabulary. The same list of English words to keep applies. Avoid Sanskrit-derived formal equivalents.
- **Tamil (ta):** Tamil has a strong tradition of using native Tamil words (தமிழ்). However, for app UI, tech terms are still commonly used in English. Err toward natural spoken Tamil over pure Tamil.
- **Telugu (te):** Similar to Tamil — keep app/tech words in English script.
- **Bengali (bn):** Urban Bengali speakers code-switch similarly to Hindi speakers. Keep English app words.
- **Marathi (mr):** Closest to Hindi in code-switching patterns. Same rules as Hindi apply.
- **Kannada (kn):** Keep English tech terms. Natural conversational Kannada for instructions.
- **Malayalam (ml):** Malayalam speakers are generally comfortable with English words for tech concepts. Prioritise natural spoken Malayalam.
- **Punjabi (pa):** Urban Punjabi has heavy English borrowing. Same approach as Hindi.

---

## What to do after generating a translation

1. Generate the translation using these rules
2. Flag any word where you were unsure whether to use English or the native word — list them explicitly so a human reviewer can check
3. For Hindi specifically, list any word where formal Hindi was used because no natural alternative was obvious
4. Note any string that is particularly long after translation — these may break the UI layout and need to be shortened

---

## How translations are added

- Source of truth: `apps/web/src/locales/en.json`
- One file per language: `apps/web/src/locales/<code>.json`
- Structure must mirror `en.json` exactly — same keys, same nesting
- i18next falls back to English automatically if a key is missing — so it is safe to add a new language incrementally
- Load the skill `/meditrack-translate` before writing any translation strings
