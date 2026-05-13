# Feature Roadmap

## I. Architectural Alignment
- **UI Design (`tangram/design/ui.md`):** Adheres to the "Apple-inspired" aesthetic. Modals and buttons will use Inter font, precise border radii (12px/18px), and established brand colors.
- **Security (`tangram/design/security.md`):** Table editing will strictly enforce the regeneration of the HMAC-SHA256 signature (`qrCodeSignature`) to prevent unauthorized access via old URLs.
- **Database (`tangram/design/structure.md`):** Will utilize Drizzle ORM to implement soft-deletion, ensuring historical order data consistency.

## II. Data Model & Schema Changes
- **Schema (`src/db/schema.ts`):** Verify if a `deletedAt` timestamp exists on the `tables` table. If not, add it to support soft deletes.
- **API Contract:** 
  - `PATCH /api/admin/tables/[tableId]`: Accepts `{ tableNumber: string }`. Returns the updated table with the new signature.
  - `DELETE /api/admin/tables/[tableId]`: Soft deletes a specific table.
  - `DELETE /api/admin/tables`: Accepts a payload of `{ tableIds: string[] }` for bulk soft deletion.

## III. Atomic Task List

### Database & Security
- [ ] **Task 1: Schema Updates for Soft Delete**
  > **Detailed Summary:** Inspect `src/db/schema.ts`. If the `tables` table does not have a `deletedAt` column, add it (`timestamp('deleted_at')`). Generate and apply the Drizzle migration. Update the primary `GET` queries in the application to filter out where `deletedAt` is not null.

### API Layer
- [ ] **Task 2: Implement Table Update (PATCH) API**
  > **Detailed Summary:** Create `src/app/api/admin/tables/[tableId]/route.ts`. Implement a `PATCH` handler. It must:
  > 1. Authenticate the admin and verify tenant ownership.
  > 2. Accept the new `tableNumber`.
  > 3. Call `signTableSignature(tenantId, newTableNumber)` from `src/lib/crypto/signature.ts`.
  > 4. Update the database record with the new `tableNumber` and `qrCodeSignature`.
  > 5. Return the updated record.

- [ ] **Task 3: Implement Table Deletion (DELETE) APIs**
  > **Detailed Summary:** 
  > 1. In `src/app/api/admin/tables/[tableId]/route.ts`, implement a `DELETE` handler to set `deletedAt = now()` for the specific ID.
  > 2. In `src/app/api/admin/tables/route.ts` (or a dedicated bulk route), implement a `DELETE` handler that accepts an array of `tableIds` and performs a batch soft-delete update.

### UI Layer
- [ ] **Task 4: UI Enhancements - QR Link Visibility & Copy**
  > **Detailed Summary:** Modify `src/components/TablesAdminClient.tsx`. For each table card, add a read-only text input (or styled text element) displaying the absolute URL (`https://[domain]/[tenantSlug]/[tableNumber]?sig=[signature]`). Add a "Copy Link" button using the Clipboard API adjacent to the link. Ensure styling matches `ui.md`.

- [ ] **Task 5: UI Enhancements - Edit Flow with Warning**
  > **Detailed Summary:** Modify `src/components/TablesAdminClient.tsx` to add an "Edit" button to each table. Clicking it should open a modal (or inline form) to change the table number. **Crucially**, include a prominent warning message: *"Warning: Changing the table number will invalidate all previously printed QR codes for this table."* Wire the form to the new `PATCH` API.

- [ ] **Task 6: UI Enhancements - Bulk and Individual Delete**
  > **Detailed Summary:** Add a "Delete" option to individual table cards. Implement a selection mechanism (checkboxes) to allow selecting multiple tables. Add a global "Delete Selected" button that appears when tables are selected. Wire these actions to the respective `DELETE` APIs, ensuring optimistic UI updates or revalidation upon success.

## IV. Critical Path & Dependencies
1. Schema update (Task 1) must happen first to enable soft deletes.
2. API routes (Tasks 2 & 3) must be built before UI implementation.
3. Task 5 depends on the signature generation logic being correctly integrated into the API.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Soft Delete** | Manual API/DB Check | Deleting a table sets `deletedAt`, table disappears from UI, but database record remains. Orders tied to it are intact. |
| **Bulk Delete** | Manual UI Flow | Selecting multiple tables and deleting removes them all from the UI and sets `deletedAt` for all in DB. |
| **Edit Table Number** | Manual UI/API Flow | Editing updates the DB. The returned `qrCodeSignature` is DIFFERENT from the old one. |
| **Invalidation Warning** | Visual Inspection | The edit modal explicitly warns about QR code invalidation before submission. |
| **Copy Absolute URL** | Manual UI Flow | Clicking "Copy" copies a fully qualified URL (e.g., `https://.../...`) that correctly resolves to the customer ordering page. |