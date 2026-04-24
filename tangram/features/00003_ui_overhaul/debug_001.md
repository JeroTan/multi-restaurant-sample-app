# Debug Log: 001 - Build-time Type Mismatches & API Inconsistencies

## Overview
The UI Overhaul introduced several type regressions where the frontend interfaces became decoupled from the actual database schema and API responses. This prevents a successful production build and causes runtime UI issues (like missing table numbers in the admin dashboard).

## Diagnostic Findings
1. **Dish Type Mismatch**: `CustomerMenuClient` expects `Dish` fields to be non-nullable, but the Drizzle schema and API return `null` for `description`, `imageUrl`, and `isSoldOut`.
2. **Prop Signature Collision**: `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx` passes a `table` object while the component expects individual primitive props.
3. **Data Vacuum (Admin Orders)**: The `OrdersClient` component requires `tableNumber` for the Kanban view, but the `/api/admin/orders` route returns raw records without joining the `tables` entity.

---

- [x] task 5 - [Fix] Synchronize Dish Interface with Database Schema
    > **Summary:** Update the `Dish` interface in `src/components/CustomerMenuClient.tsx` to allow `null` for `description`, `imageUrl`, and `isSoldOut`. This aligns the frontend with the database-inferred types returned by Drizzle.

- [x] task 5 - [Fix] Resolve Prop Mismatch in Customer Ordering Page
    > **Summary:** Update `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx` to pass the correct primitive props (`tableId` and `tableNumber`) instead of the entire `table` object.

- [x] task 4 - [Fix] Enhance Admin Orders API with Table Data
    > **Summary:** Refactor the `GET` handler in `src/app/api/admin/orders/route.ts` to perform a SQL JOIN with the `tables` table using Drizzle. This ensures the frontend receives the required `tableNumber` for each order.
