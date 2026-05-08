# Debug Log: 00013_debug_002

## Issue Overview
Customer API endpoints (e.g., `/api/customer/orders`) are being intercepted by the Admin authentication middleware. This causes legitimate customer requests to fail with a `401 Unauthorized` or `403 Forbidden` error because the middleware expects an `admin_token` cookie.

## Root Cause Analysis
The `MiddlewareBuilder` in `src/worker-middleware.ts` uses broad wildcard patterns for securing admin routes. Specifically, the pattern `*/orders` matches ANY path ending in `/orders`, including `/api/customer/orders`. Since the builder continues through all matching route blocks unless a `Response` is returned, the customer API correctly bypasses block #1 (Public) but then gets caught by block #3 or #4 (Secure Admin) because of the overlapping pattern.

## Diagnostic Steps
1. **Verify Pattern Matching**: Confirmed that `*/orders` regex `^.*\/orders$` matches `/api/customer/orders`.
2. **Review Middleware Chain**: The `MiddlewareBuilder` runs handlers for all matching blocks sequentially. Even if a path is marked "public" in block #1, if it also matches "secure" in block #4, it will be blocked.

## Fixing Checklist

- [x] task 4.1 - [Restrict Admin Page Wildcards]
  > **Summary:** Refactor the patterns in `src/worker-middleware.ts` block #4 (Secure Admin Pages) to be more specific. Instead of `*/orders`, use patterns that explicitly target the restaurant slug prefix but exclude the `api` and `auth` paths, or simply require at least one segment before the keyword (e.g., `/[^/]+/orders`). However, since `MiddlewareBuilder` uses simple `.*` for `*`, we should use more explicit paths like `/*/orders`. Actually, a better approach is to exclude `api/*` from the wildcard matching in the secure blocks.

- [x] task 3.1 - [Restrict Admin API Wildcards]
  > **Summary:** Ensure Admin API patterns in block #3 are strictly prefixed with `/api/admin/`. Currently they are, but verify they don't have leading wildcards that might catch customer routes.

- [x] task 1.2 - [Middleware Logic Refinement]
  > **Summary:** Update the "Public" block in `src/worker-middleware.ts` to return a specific "continue" signal or handle it so that if a path is explicitly public, it doesn't even check the secure blocks. However, the current architecture relies on sequential checks. The safest fix is to ensure patterns are mutually exclusive.
