# Debug Log: 003 - Final Frontend Restoration (Tracking & API Sync)

## Overview
A second wave of regressions was identified: the Admin dashboard is not displaying orders, and the Customer tracking functionality is missing. These were functional prior to the UI overhaul.

## Diagnostic Findings
1. **Port Desync (Admin)**: `OrdersClient.tsx` only adjusted the port for WebSockets. Standard `fetch` calls are still hitting Port 3000, which lacks D1 bindings in development.
2. **API Inefficiency**: The `GET /api/admin/orders` route is fetching all items in the database and filtering them in memory, which is causing failures/timeouts.
3. **Missing Tracking UI**: The entire "Active Orders" logic and UI were accidentally deleted from `CustomerMenuClient.tsx` during the refactor.
4. **Type Fragility**: `totalPrice.toFixed(2)` crashes if the value is null or undefined.

---

- [x] task 4 - [Fix] Restore Admin Orders & Port Synchronization
    > **Summary:** Refactored `OrdersClient.tsx` to route all API calls through Port 8787 in development. Added safety guards for currency formatting and null checks for order data.

- [x] task 4 - [Fix] SQL-level Filtering for Orders API
    > **Summary:** Optimized `src/app/api/admin/orders/route.ts` to perform multi-stage SQL filtering (Orders -> Items), ensuring reliable data delivery without timeouts.

- [x] task 5 - [Fix] Restore Customer Order Tracking Section
    > **Summary:** Re-implemented the "Your Orders" UI and 15s polling logic in `CustomerMenuClient.tsx`, maintaining the new Apple-inspired visual hierarchy.
