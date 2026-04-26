# Sequential Debug Log: Middleware Modularization per Route Type

**Issue Addressed**: The user correctly pointed out that the `MiddlewareBuilder` wasn't being fully utilized to its potential. Different types of routes (Auth APIs, Auth Pages, Admin APIs, Admin Pages) were mashed together in large blocks, causing `auth/register` to fall through into the secure `admin` block. The user also requested that logged-in users who visit auth pages should be redirected to their dashboard.

## Fixing Checklist

- [x] task 4 - Modularize Middleware System
  > **Summary:** Refactor the middleware rules into distinct blocks to prevent overlap and improve UX.
  > 1. Update `types.ts` and `builder.ts` to support a `'BYPASS'` return type, allowing a route block to say "I'm done checking, let Next.js handle this" without evaluating subsequent route blocks.
  > 2. Create distinct builder `.path()` blocks in `worker-middleware.ts`:
  >    - Public Assets & Customer Routes -> `'BYPASS'`
  >    - Auth APIs (`/api/admin/auth/*`) -> `'BYPASS'`
  >    - Auth Pages (`/auth/*`) -> Check token. If valid, `redirect` to dashboard. If invalid, `'BYPASS'` (allow them to login/register).
  >    - Admin APIs (`/api/admin/*`) -> Require token or return `401 Unauthorized`.
  >    - Admin Pages (Orders, Menu, Tables) -> Require token or `redirect` to login.
  > 3. Build the worker.