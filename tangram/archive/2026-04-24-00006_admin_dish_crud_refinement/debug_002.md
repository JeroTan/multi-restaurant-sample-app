# Debug Log: 002 - Soft Delete with Scheduled Daily Cleanup

## Overview
To handle foreign key constraints on dish deletion while keeping the database clean, we are implementing a **Hybrid Delete Strategy**:
1. **Soft Delete**: Instantly mark dishes as deleted to hide them from menus.
2. **Scheduled Hard Delete**: A daily Cloudflare Worker Cron Trigger will find "orphaned" soft-deleted dishes (those NOT present in any `order_items`) and remove them completely.

## Diagnostic Findings
1. **FK Constraint**: `order_items` prevents deleting dishes that have been sold. (FIXED via Soft Delete)
2. **Worker Context**: `src/worker.ts` handles fetch/websocket; added a `scheduled` handler. (FIXED)
3. **Wrangler Config**: `wrangler.jsonc` needs a `triggers.crons` entry. (FIXED)

---

- [x] task 1.1 - [Database] Add Soft Delete Column
    > **Summary:** Updated `src/db/schema.ts` to include `isDeleted`. Created migration `0001_soft_delete.sql`.

- [x] task 1.2 - [API] Refactor Delete to Soft Delete
    > **Summary:** Modified `src/app/api/admin/menu/dishes/[id]/route.ts`. `DELETE` now sets `isDeleted: true`.

- [x] task 1.3 - [API] Filter Deleted Items
    > **Summary:** Updated `src/app/api/admin/menu/dishes/route.ts` and `src/app/api/customer/menu/route.ts` to filter out dishes where `isDeleted` is true.

- [x] task 2.1 - [Worker] Setup Cron Trigger
    > **Summary:** Updated `wrangler.jsonc` with a daily cron trigger at 00:00.

- [x] task 2.2 - [Worker] Implement Cleanup Logic
    > **Summary:** Implemented `scheduled` handler in `src/worker.ts` that hard-deletes `is_deleted = 1` dishes not referenced in `order_items`.
