# Feature Summary

**Feature ID:** 00015
**Feature Name:** Table Management and QR Visibility

## Intent
The core objective is to empower restaurant administrators with full lifecycle management of their tables. Currently, tables can only be created. This feature introduces the ability to edit table numbers (with appropriate security warnings) and to soft-delete tables (individually or in bulk) to preserve historical order data while cleaning up the active UI. Additionally, it improves the usability of the QR code distribution by making the absolute link visible and easily copyable.

## Scope
- **Database:** Add soft-delete functionality to the `tables` table (if not already present via global soft delete mechanisms).
- **API:** Implement `PATCH` and `DELETE` endpoints for individual table management, and a `DELETE` endpoint for bulk operations.
- **UI (Admin):** 
  - Update `TablesAdminClient.tsx` to support inline editing or an edit modal with a warning about QR code invalidation.
  - Add individual and bulk delete actions.
  - Make the QR link visible as an absolute URL and provide a one-click "Copy" button next to it.
- **Security:** Ensure that editing a table number securely regenerates the HMAC `qrCodeSignature` using existing Cloudflare Worker compatible crypto utilities.
- **Refinement:** Added a functional "Log Out" button to the admin dashboard sidebar (via `debug_001.md`).
- **Fix:** Resolved a page crash on the Tables page by adding defensive UI handling and fixing a migration conflict for the `isDeleted` column (via `debug_002.md`). Secured bulk delete API with `tenantId` verification.
- **UI Refinement:** Refactored table cards for better layout (removing absolute overlaps), improved icon contrast (Apple Red for delete), and enhanced mobile responsiveness (via `debug_005.md`).

## Strategic Fit
This aligns directly with the goal of providing a robust, multi-tenant SaaS for restaurants. Complete CRUD operations are foundational for a production-ready application, and making QR links easily accessible removes friction for restaurant owners onboarding their physical locations.

## Final Execution Log

### What was Built
- **Complete Table Lifecycle Management:** Administrators can now edit table numbers and perform soft-deletes (individual and bulk).
- **Secure Table Invalidation:** Editing a table number automatically regenerates the HMAC-SHA256 signature, invalidating old URLs to maintain security.
- **Enhanced QR Distribution:** Absolute URLs for table ordering pages are now visible and copyable from the admin dashboard.
- **Admin Refinements:** Added dashboard logout functionality and refactored table cards for better layout and accessibility.
- **System Stability:** Fixed migration conflicts, secured bulk delete APIs, and implemented defensive UI handling to prevent page crashes.

### Challenges & Fixes
- **Migration Conflicts:** Resolved a database schema clash by re-indexing SQL migrations sequentially (debug_002).
- **TypeScript & Build:** Overcame type inference issues with API responses in React components to ensure stable builds (debug_003, debug_004).
- **Worker/DO Exports:** Navigated Cloudflare `workerd` export requirements to ensure Durable Objects are correctly recognized in a custom OpenNext worker (debug_004).
- **UI Collisions:** Solved absolute-positioning overlaps in table cards by refactoring to a flex-based layout (debug_005).

### Design Adherence
- **UI:** Follows `tangram/design/ui.md` with Apple-inspired aesthetics, using `text-apple-red` for destructive actions and maintaining consistent spacing.
- **Security:** Follows `tangram/design/security.md` by enforcing signature regeneration and cross-tenant API verification.
- **Structure:** Follows `tangram/design/structure.md` via Drizzle-based soft-deletes.