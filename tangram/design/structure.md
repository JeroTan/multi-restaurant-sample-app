# Folder Structure

**Source of Truth:** Internal Next.js App Router Patterns + D1 integration logic.

## Directory Tree

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── (customer)/       # H5 Ordering Interface
│   ├── (admin)/          # Dashboard for Staff & Admins
│   └── api/              # Edge API Routes
├── components/           # UI Design System (Atoms, Molecules, Organisms)
├── db/                   # D1 Database Layer
│   ├── schema.ts         # Drizzle ORM Schema definitions
│   └── migrations/       # SQL Migration files
├── lib/                  # Utilities (HMAC generators, QR logic)
└── i18n/                 # next-intl configuration and dictionaries
```

## Domain Logic
Data access and business logic (e.g., `createOrder`, `getMenu`) should be isolated within domain-specific service files inside `src/db/` or a `src/features/` directory to keep Edge API routes clean.
