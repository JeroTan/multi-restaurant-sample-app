# Debug Log: 005 - Cleanup Refactor & SSR Filter Fix

## Overview
Small refactor to keep `src/worker.ts` clean by moving cleanup logic to `src/lib/tasks.ts`. Also addressing the issue where soft-deleted dishes were still appearing on the customer SSR page.

## Diagnostic Findings
1. **Cluttered Worker**: `src/worker.ts` contained raw SQL and business logic for cleanup. (FIXED)
2. **Missing SSR Filter**: `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx` was fetching dishes without the `isDeleted` filter. (FIXED)

---

- [x] task 2.3 - [Refactor] Move Cleanup to src/lib/tasks.ts
    > **Summary:** Created `src/lib/tasks.ts` and exported a `runDailyCleanup(env)` function. Moved the SQL logic from `src/worker.ts` to this new function. Updated `src/worker.ts` to call this utility.

- [x] task 1.5 - [API] Filter Deleted Items in Customer SSR
    > **Summary:** Refactored the dish query in `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx`. Updated the `where` clause to include `and(eq(dishes.tenantId, tenant.id), eq(dishes.isDeleted, false))`.
