# Sequential Debug Log: Simplify Middleware Return Types

**Issue Addressed**: The middleware return types (`'BYPASS'`, `'NEXT'`, `void`) were overly complicated and confusing. The user correctly requested a much simpler architecture where a handler just returns `next()` (to continue checking blocks) or a `Response` (to abort/redirect).

**Root Cause Analysis**:
The previous complexity was introduced because `/api/admin/auth/*` was accidentally matching the catch-all `/api/admin/*` secure block, forcing us to invent a "break chain" signal. Instead of complex return signals, we can simply define mutually exclusive path patterns (e.g., explicitly defining secure API paths instead of using a wildcard that also catches auth APIs).

## Fixing Checklist

- [x] task 4 - Modularize Middleware System
  > **Summary:** Simplify `MiddlewareResult` to just `Response | void`, relying on exclusive route patterns instead of complicated return strings.
  > 1. Simplify `src/lib/middleware/types.ts` so `MiddlewareResult` is just `Response | void`.
  > 2. Simplify `src/lib/middleware/builder.ts` to only abort if the result is a `Response`, otherwise it naturally falls through to the next route blocks.
  > 3. Update `src/worker-middleware.ts` to use explicit paths for secure APIs (e.g. `/api/admin/menu/*`, `/api/admin/orders/*`, `/api/admin/tables/*`, `/api/admin/tenants/*`) to avoid accidentally matching `/api/admin/auth/*`.
  > 4. Simplify all handlers in `worker-middleware.ts` to just `return next()` or `return new Response(...)`.
  > 5. Build the worker.