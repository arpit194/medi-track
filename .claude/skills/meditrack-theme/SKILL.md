---
name: meditrack-theme
description: How to read MediTrack's live theme — where tokens are defined, how to interpret them, and the design rules that govern their use.
---

# MediTrack — Reading the Theme & Design System

To get the current, authoritative colour tokens, typography, and radius scale:

```
Read: src/styles.css
```

Do not rely on any cached or hardcoded token list — always read the file directly.

---

## How to Read `src/styles.css`

The file is structured in four blocks:

| Block | What it contains |
|---|---|
| `@theme { }` | Font family definitions (`--font-primary`, `--font-serif`) |
| `:root { }` | Light mode semantic token values (OKLCH) |
| `.dark { }` | Dark mode overrides for the same tokens |
| `@theme inline { }` | Maps CSS vars → Tailwind utility names (e.g. `--color-primary`) |

When you read a token from `:root`, the matching Tailwind class is the token name without `--` prefix and with `bg-`/`text-`/`border-` applied. For example, `--primary` → `bg-primary` / `text-primary`.

---

## Stable Rules (these don't change with the file)

### Always use semantic tokens — never raw colours

```
✅ bg-primary        ❌ bg-teal-500
✅ text-muted-foreground   ❌ text-gray-400
✅ bg-destructive    ❌ bg-red-600
```

### Token intent

| Token family | Use |
|---|---|
| `background` / `foreground` | Page base only |
| `card` | Elevated surfaces |
| `primary` | Teal — primary actions only, use sparingly |
| `muted` | Secondary text, disabled states, helper copy |
| `destructive` | Errors, deletes, irreversible actions — nothing else |
| `sidebar` | Sidebar surface — distinct from card |
| `chart-1` → `chart-5` | Data visualisations only — not general UI |

### Typography

- `font-primary` (Manrope) — all UI text: labels, buttons, inputs, body, nav
- `font-serif` (Playfair Display) — display/headings on auth and onboarding pages only
- Minimum content text size: `text-base` (16px) — never use `text-xs` for anything users read
- Body copy: `leading-relaxed`

### Dark mode

All semantic token classes automatically remap in `.dark` — you do not need `dark:` variants when using tokens. Only add `dark:` for one-off overrides that have no token.

### Spacing & layout

- Base units: `gap-4`, `gap-6`, `p-4`, `p-6`
- Page max width: `max-w-5xl` or `max-w-4xl`, centred
- Card internal padding: minimum `p-6`
- Touch targets: minimum `min-h-11 min-w-11` (44×44 px)

---

## When the Theme Changes

If `src/styles.css` is modified, the source file is the truth — re-read it. Do not assume previous knowledge of token values is current.