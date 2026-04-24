# Debug Log: 004 - Deleted Dishes Showing in Customer SSR Page

## Overview
Deleted dishes are correctly filtered in API routes, but they still appear on the main customer ordering page because the Server Component (SSR) fetches the menu directly from the database without checking the `isDeleted` flag.

## Diagnostic Findings
1. **Consistency Gap**: `src/app/api/customer/menu/route.ts` was updated, but `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx` was missed.
2. **Root Cause**: The SSR query for dishes only filters by `tenantId`, ignoring the soft-delete status.

---

- [x] task 1.5 - [API] Filter Deleted Items in Customer SSR
    > **Summary:** Refactor the dish query in `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx`. Update the `where` clause to include `and(eq(dishes.tenantId, tenant.id), eq(dishes.isDeleted, false))`. This ensures the initial page load respects the soft-delete status.
