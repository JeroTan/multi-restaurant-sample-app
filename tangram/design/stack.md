# Tech-Stack

**Source of Truth:** User Prompt + `multi-restaurant-design-ui.md`

## Core Stack
- **Framework:** Next.js (App Router).
- **Compute:** Cloudflare Workers via OpenNext.
- **Database:** Cloudflare D1.
- **ORM:** Drizzle ORM.
- **Styling:** Tailwind CSS + `next/font/google`.

## Tailwind Configuration Requirements
- **Fonts:** Map `font-display` to `Inter Tight` and `font-body` to `Inter`.
- **Letter Spacing:** Custom utilities for Apple-spec tracking (e.g., `tracking-apple-tight: -0.02em`).
- **Line Heights:** Custom leading values (1.05, 1.08, 1.1).
- **Colors:** Extend palette with the Neutral Triad and Graphite Series.

## Supporting Libraries
- **Icons:** Lucide React (Restrained, thin stroke weight).
- **Internationalization:** `next-intl`.
- **Data Fetching:** React Query.
- **D&D:** `@dnd-kit`.
