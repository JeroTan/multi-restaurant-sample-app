# Debug Log: 003 - Authentication Bypass on Admin Pages

## Overview
Admin pages (e.g., `/[tenantSlug]/orders`) were accessible without logging in. This was caused by an overly restrictive middleware matcher that accidentally excluded any path with exactly two segments.

## Diagnostic Findings
1. **Matcher Regex**: The regex `[^/]+/[^/]+$` in the middleware configuration matched `tenant-slug/orders`. (FIXED)
2. **Negative Lookahead**: Because it matched the exclusion pattern, the middleware was never triggered for these routes. (FIXED)
3. **Collision**: Both Customer H5 (`/tenant/1`) and Admin Pages (`/tenant/orders`) had the same segment count. (FIXED via logic refinement)

---

- [x] task 4.2 - [Middleware] Fix Route Protection Matcher
    > **Summary:** Refactored the `matcher` and logic in `src/middleware.ts`. Removed the segment-count based exclusion from the config. Implemented explicit reserved keyword checking (`orders`, `menu`, `tables`) to protect admin routes while keeping customer table routes public.
