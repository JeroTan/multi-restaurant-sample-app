# Sequential Debug Log: Middleware Public Routes Fallthrough

**Issue Addressed**: The user gets a 401 Unauthorized error when accessing `/api/admin/auth/register`, which should be a public route.

**Root Cause Analysis**: 
When the custom `MiddlewareBuilder` encounters a public route (e.g. `/api/admin/auth/*`), it logs a bypass message and returns `'NEXT'`. However, in our chainable architecture, `'NEXT'` tells the builder to evaluate the *next* block of routes. Because `/api/admin/auth/register` ALSO matches the general `/api/admin/*` admin guard, it falls through to the admin check and correctly blocks the request due to a missing token.

## Fixing Checklist

- [x] task 4 - Modularize Middleware System
  > **Summary:** Introduce a `'BYPASS'` signal to allow middleware handlers to completely break out of the chain and hand the request back to the underlying Next.js server.
  > 1. Update `src/lib/middleware/types.ts` to add `'BYPASS'` to `MiddlewareResult`.
  > 2. Update `src/lib/middleware/builder.ts` to immediately return `null` (breaking the chain) when a handler returns `'BYPASS'`.
  > 3. Update `src/worker-middleware.ts` public routes block to return `'BYPASS'` instead of `'NEXT'`.
  > 4. Rebuild the worker.