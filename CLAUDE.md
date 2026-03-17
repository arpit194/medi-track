# MediTrack — Claude Rules

## Stack
- **Framework:** TanStack Start + TanStack Router (file-based routing)
- **UI:** React 19, Tailwind CSS v4, shadcn v4 (`base-nova` style, Base UI)
- **Language:** TypeScript (strict mode)
- **Path alias:** `#/` maps to `src/`

## Routing
- Routes live in `src/routes/` using file-based routing
- `_auth/` — pathless layout group for unauthenticated pages (login, signup, etc.)
- `_app/` — pathless layout group for authenticated app pages
- `s/` — public shared report views (no auth)
- Dynamic segments use `$` prefix (e.g. `$id`, `$token`)
- Always use TanStack Router's `<Link>` — never a raw `<a>` tag for internal navigation
- Always use `useNavigate` from TanStack Router — never `window.location`

## Route Files
- Route files must be **thin** — they compose components, they do not contain UI
- No JSX logic, no inline styles, no large blocks of code inside route files
- Keep route files under ~30 lines where possible

## Component Organisation
Components mirror the route structure so any file is easy to find:

```
src/components/
├── ui/                  # shadcn auto-generated — do not edit manually
├── shared/              # Truly global reusable components
│   ├── layout/          # AppShell, Sidebar, Header, AuthLayout, etc.
│   └── ...              # Common patterns: EmptyState, ErrorBoundary, etc.
├── auth/                # Components used in _auth/* routes
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── ...
└── app/                 # Components used in _app/* routes
    ├── dashboard/
    ├── reports/
    ├── timeline/
    ├── onboarding/
    ├── share/
    └── settings/
```

- If a component is used in **more than one route**, it belongs in `shared/`
- If a component is used in **one route only**, it lives in the folder matching that route
- Component filenames are `PascalCase.tsx`

## Design System

### Philosophy
MediTrack is used primarily by **patients** managing their own medical records digitally — replacing physical folders of hard copies. Users span a wide range of ages and tech comfort levels, including elderly and non-tech-savvy individuals. Every design decision must prioritise:
- **Clarity over cleverness** — obvious over clever, always
- **Accessibility** — large tap targets, clear focus states, high contrast, readable font sizes
- **Trust** — clean, calm aesthetic that feels safe and reliable, not intimidating
- **Forgiveness** — make it hard to do something irreversible by accident; always confirm destructive actions
- **Mobile-first** — patients are likely on their phone, not a desktop

### Typography
- **Body / UI text:** `font-primary` (Manrope) — used for all labels, inputs, body copy, navigation
- **Display / headings:** `font-serif` (Playfair Display) — used sparingly for page titles and marketing-style moments (e.g. auth pages, onboarding)
- Minimum body text size: `text-base` (16px) — never go smaller than `text-sm` for meaningful content
- Line height should be generous — prefer `leading-relaxed` for body copy

### Colour
Tokens are defined in `src/styles.css`. Use semantic tokens, never raw colours:
- `bg-background` / `text-foreground` — page base
- `bg-card` / `text-card-foreground` — elevated surfaces
- `bg-primary` / `text-primary-foreground` — teal/green, primary actions only
- `text-muted-foreground` — secondary/helper text
- `bg-destructive` — errors, deletes, irreversible actions only
- `bg-sidebar` — sidebar surface (distinct from card)
- Chart colours `chart-1` → `chart-5` — teal-family gradient, for data visualisations

### Spacing & Layout
- Use consistent spacing scale — prefer `gap-4`, `gap-6`, `p-4`, `p-6` as base units
- Page content max width: `max-w-5xl` or `max-w-4xl` centred — never full bleed prose
- Cards and sections should breathe — minimum `p-6` internal padding on cards
- Group related actions and information together — reduce cognitive load

### Components
- Buttons: use `size="lg"` for primary CTAs on auth/onboarding pages — larger targets
- Form fields: always pair with a visible `<Label>` — no placeholder-only labels
- Destructive actions (delete, revoke) must use a `Dialog` confirmation — never inline
- Empty states must always explain what to do next — use the `Empty` shadcn component
- Loading states must use `Skeleton` — never show a blank area
- Errors must be surfaced inline near the relevant field, not just as a toast
- Use `Sonner` (toast) only for transient success confirmations (e.g. "Link copied")

### Accessibility
- All interactive elements must have visible focus rings (Tailwind `ring` utilities)
- Icon-only buttons must have an `aria-label`
- Colour alone must never be the only indicator of state (add text or icon too)
- Form inputs must always have associated labels (use `htmlFor` / `id` pairing)
- Minimum touch target size: 44×44px — use `min-h-11 min-w-11` where needed

### Tone
- UI copy is calm, warm, and human — not clinical, not overly technical
- Avoid medical jargon in UI text — write as if explaining to a family member
- Error messages explain what went wrong and what to do next (never just "Error occurred")
- Empty states are encouraging and tell the user exactly what to do next
- Labels and instructions should be self-explanatory — assume no prior app experience

## Code Quality
- No comments unless the logic is genuinely non-obvious
- No `any` types — use proper TypeScript types always
- No unused imports, variables, or parameters (TypeScript strict enforces this)
- Prefer `import type` for type-only imports (`verbatimModuleSyntax` is enabled)
- Avoid `useEffect` for data fetching — use TanStack Query when needed

## Behaviour

### Think Before Acting
Before writing any code, pause and consider:
- Is this the simplest solution that solves the problem?
- Am I adding complexity that isn't needed yet?
- Does this fit the existing patterns in the codebase, or am I introducing a new one?
- If introducing a new pattern, is it worth the inconsistency?
- Am I solving the stated problem, or gold-plating it?

If the answer to any of these is unclear, ask before proceeding.

### Challenge Requirements
If a request or approach seems off, say so — act as a tech lead, not an executor:
- If asked for X, first consider whether there's a better or simpler way and say so
- Flag over-engineering before building it
- Suggest simpler alternatives before reaching for the complex solution
- If something feels architecturally wrong, raise it — don't just implement it

### Prefer Existing Patterns
Always check how similar problems are already solved in the codebase before introducing anything new. Consistency beats cleverness.

### When in Doubt, Ask
A short clarifying question is always better than building the wrong thing confidently.

## Skills
- Always load `/meditrack-context` at the start of any MediTrack task
- Use `/meditrack-page` when scaffolding a new route
- Use `/meditrack-component` when building new UI components
- Use `/meditrack-routes` to get the full route map and URL patterns
- Use `/meditrack-theme` when referencing colour tokens, typography, spacing, or dark mode rules

## Reminders
- If I correct Claude on something worth keeping, prompt me to add it here.
