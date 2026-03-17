---
name: meditrack-routes
description: How to read MediTrack's live route map — where routes live, how to enumerate them, and how to interpret file names as URLs.
---

# MediTrack — Reading the Route Map

To get the current, authoritative list of routes, glob the routes directory:

```
src/routes/**/*.tsx
```

Do not rely on any cached or hardcoded list — always read from the file system.

---

## How File Paths Map to URLs

TanStack Router uses file-based routing. Rules:

| File path pattern | Behaviour |
|---|---|
| `__root.tsx` | HTML shell — not a route |
| `index.tsx` | Maps to `/` of its parent segment |
| `_name/` | **Pathless layout group** — `_name` does not appear in the URL |
| `$segment` | Dynamic param — e.g. `$id` captures any value as `params.id` |
| `$.tsx` | Catch-all — renders for any unmatched path (404) |
| `route.tsx` inside a folder | Layout wrapper for that folder — not a URL itself |

## Layout Groups

| Folder | URL prefix | Purpose |
|---|---|---|
| `_auth/` | (none) | Unauthenticated pages — login, signup, password reset |
| `_app/` | (none) | Authenticated app pages — requires session |
| `s/` | `/s/` | Public shared report views — no auth, minimal chrome |

## Reading a Route File

Route files are thin by convention (under ~30 lines). To understand what a route renders, find the component it imports and read that instead — the real logic lives in `src/components/`.

Component location mirrors the route:
- `_app/reports/upload.tsx` → component in `src/components/app/reports/`
- `_auth/login.tsx` → component in `src/components/auth/`
- Shared across routes → `src/components/shared/`

---

## Adding a New Route

Use `/meditrack-page` — it covers file naming, layout group selection, component placement, and thin-route conventions.