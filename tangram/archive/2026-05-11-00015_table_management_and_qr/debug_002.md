# Debug Session 002: Tables Page Crash and Migration Conflict

This session addresses the "crash after a few seconds" on the Tables page, which is caused by the UI trying to map over an error object returned by the API when the database query fails.

## Diagnostic Summary
- **Root Cause (Client):** `TablesAdminClient.tsx` calls `setTables(data)` without checking if `data` is an array. When the API fails (e.g., 500 error), `data` is an object `{ error: "..." }`, and `tables.map` throws a TypeError.
- **Root Cause (Database):** A migration conflict exists (`0001_keen_marrow.sql` and `0001_soft_delete.sql` both use index `0001`). This likely prevented the `is_deleted` column from being added to the `tables` table, causing the API to return a 500 error.
- **Security Flaw:** The bulk `DELETE` endpoint in `src/app/api/admin/tables/route.ts` does not verify `tenantId`, allowing potential cross-tenant deletions.

## Fixing Checklist

- [x] task 4.1 - Defensive UI Handling in TablesAdminClient
  > **Summary:** Update `fetchTables` in `src/components/TablesAdminClient.tsx` to check `res.ok` and `Array.isArray(data)`. Only update state if valid. Add a defensive `Array.isArray(tables) && ...` check in the JSX to prevent future crashes.
  
- [x] task 1.1 - Resolve Migration Naming Conflict
  > **Summary:** Re-index the migrations. Rename `0001_keen_marrow.sql` to `0004_add_table_soft_delete.sql` (or the next sequential number) and ensure the `meta/` folder is updated or regenerate if necessary. For this fix, I will rename the files to be sequential: 0000, 0001, 0002, 0003, 0004.

- [x] task 3.1 - Secure Bulk Delete API
  > **Summary:** Update the `DELETE` handler in `src/app/api/admin/tables/route.ts` to accept and verify `tenantId` in the request body. Ensure the `where` clause includes an `eq(tables.tenantId, tenantId)` check to scope the deletion.
