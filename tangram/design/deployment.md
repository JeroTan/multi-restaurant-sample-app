# Deployment Strategy

**Source of Truth:** User Prompt (OpenNext + Cloudflare Worker/D1).

## Hosting
- **Application:** Cloudflare Workers / Pages via OpenNext (`@opennextjs/cloudflare`).
- **Database:** Cloudflare D1.

## CI/CD Pipeline
- **Wrangler:** Local development and deployment configuration managed via `wrangler.jsonc` (or `wrangler.toml`).
- **OpenNext CLI:** Build step utilizes OpenNext to natively adapt Next.js for Cloudflare via the official Deployment Adapters API.
- **GitHub Actions:** 
  1. Lints and type-checks code.
  2. Runs D1 schema migrations (`wrangler d1 migrations apply`).
  3. Builds via OpenNext and deploys to Cloudflare.
