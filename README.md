# MediTrack

MediTrack is a patient-facing web app for digitally managing medical reports — replacing physical folders of paper hard copies. Patients can upload reports, view them on a timeline, and share them securely with doctors via tokenised links that require no account on the recipient's end.

## Documentation

| Document | Description |
|---|---|
| [Product Requirements](docs/PRD.md) | Problem statement, target users, features, design principles, and roadmap |
| [Developer Setup](docs/SETUP.md) | Prerequisites, environment variables, running locally, and scripts reference |
| [Architecture](docs/ARCHITECTURE.md) | Monorepo structure, tech stack, data flow, and key patterns |

## Quick start

```bash
pnpm install
pnpm dev:api   # API on http://localhost:3001
pnpm dev       # Web on http://localhost:3000
```

See [docs/SETUP.md](docs/SETUP.md) for full setup instructions including database and environment variables.
