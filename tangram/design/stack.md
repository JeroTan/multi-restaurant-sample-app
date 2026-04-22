# Tech-Stack

**Source of Truth:** User Prompt + `tangram/overview.md` (Next.js + OpenNext)

## Core Stack
- **Framework:** Next.js (App Router).
- **Compute:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`).
- **Database:** Cloudflare D1 (SQLite at the Edge).
- **ORM / Query Builder:** Drizzle ORM (Optimized for D1 and Edge environments).
- **Styling:** Tailwind CSS.

## Supporting Libraries
- **Internationalization:** `next-intl` (Edge compatible).
- **QR Code Generation:** `qrcode` (or lightweight edge equivalent).
- **Data Fetching:** React Query (for staff dashboard polling and caching).
