# Multi-Restaurant SaaS QR Ordering Platform

A multi-tenant QR code ordering platform built with Next.js 14 (App Router), Cloudflare Workers, and D1.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Local Development
```bash
# Start the Next.js development server
npm run dev

# Preview the Cloudflare Pages environment locally
npm run preview
```

### 3. Database Management (Cloudflare D1)
```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations to local D1 instance
npm run db:migrate
```

## 🏗️ Architecture
- **Framework:** Next.js 14+ (App Router)
- **Runtime:** Cloudflare Pages (Edge Runtime)
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS

## 📂 Project Structure
- `src/app/(customer)`: H5 ordering interface for customers.
- `src/app/(admin)`: Management dashboard for restaurant staff and admins.
- `src/db/schema.ts`: Database schema and multi-tenancy logic.
- `tangram/`: Project design pillars and research documents.

---
*Built with Tangram Build System*
