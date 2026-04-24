# Debug Log: 006 - Category CRUD & Safe Deletion (Admin & Customer)

## Overview
The user requested the ability to modify and delete categories. This is now fully implemented across the Admin and Customer interfaces using a soft-delete mechanism.

## Diagnostic Findings
1. **API Gap**: Implemented `api/admin/menu/categories/[id]` with `PATCH` and `DELETE`. (FIXED)
2. **Filtering Gap**: Updated all category queries to filter for `isDeleted: false`. (FIXED)
3. **UI Gap**: Added Edit/Delete icons and modals to `MenuAdminClient.tsx`. (FIXED)

---

- [x] task 7.1 - [Database] Add Soft Delete to Categories
    > **Summary:** Updated `src/db/schema.ts` and applied migration `0002_category_soft_delete.sql`.

- [x] task 7.2 - [API] Implement Category Dynamic Route
    > **Summary:** Created `src/app/api/admin/menu/categories/[id]/route.ts` with `PATCH` and cascading `DELETE` (also soft-deletes dishes in the category).

- [x] task 7.3 - [API] Filter Deleted Categories (Admin & Customer)
    > **Summary:** Updated `src/app/api/admin/menu/categories/route.ts` and `src/app/api/customer/menu/route.ts`.

- [x] task 7.4 - [API] Filter Deleted Categories in Customer SSR
    > **Summary:** Updated `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx` with the `isDeleted: false` filter.

- [x] task 7.5 - [UI] Category Management Controls
    > **Summary:** Refactored `MenuAdminClient.tsx` to include Category Edit/Delete headers and respective modals.
