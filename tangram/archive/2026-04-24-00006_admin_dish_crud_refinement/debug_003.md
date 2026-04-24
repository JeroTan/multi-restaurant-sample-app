# Debug Log: 003 - Missing Database Migration for Soft Delete

## Overview
The runtime error `SQLITE_ERROR: no such column: dishes.is_deleted` indicates that although the migration file was created, it was not applied to the local D1 database.

## Diagnostic Findings
1. **Error**: Column `is_deleted` is missing during query execution. (FIXED)
2. **Root Cause**: `npx wrangler d1 migrations apply` was not executed after creating `0001_soft_delete.sql`. (FIXED)
3. **Location**: Local SQLite database used by Wrangler. (FIXED)

---

- [x] task 1.4 - [Database] Apply Soft Delete Migration
    > **Summary:** Executed `npx wrangler d1 migrations apply multi-restaurant-db --local` to physically add the `is_deleted` column to the local development database. This resolves the runtime crash.
