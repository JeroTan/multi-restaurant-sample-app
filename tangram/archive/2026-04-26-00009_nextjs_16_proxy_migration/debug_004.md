# Sequential Debug Log: Global Env Realignment

**Issue Addressed**: All instances of `process.env` must be replaced with the centralized `getEnv()` utility from `src/lib/cloudflare.ts` to ensure consistent and reliable access to Cloudflare bindings in Next.js 16/OpenNext.

## Fixing Checklist

- [x] task 3 - Async Server Primitives Refactor
  > **Summary:** Successfully migrated all environmental access to the centralized `getEnv()` utility.
  > 1. Updated `src/db/index.ts`, `src/worker-middleware.ts`, and multiple API routes to import and use `getEnv()`.
  > 2. Verified that all Cloudflare bindings (DB, ORDERING_SYSTEM_BUCKET, ORDER_SYNC) and secrets are correctly retrieved at runtime.
  > 3. Removed all legacy `process.env` references from the TypeScript codebase.

