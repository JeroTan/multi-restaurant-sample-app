# Feature Agenda

## Feature Details
- **ID:** 00015
- **Name:** Table Management and QR Visibility
- **Objective:** Add full CRUD capabilities (Edit/Delete) for tables and improve the visibility and copy-ability of the QR code links in the Admin UI.

## Validated Requirements

1. **Delete Behavior:**
   - **Decision:** Soft Delete.
   - **Rationale:** Better for data integrity. If a table is deleted, we don't want to orphan existing orders tied to that table in the historical data. We will add a `deletedAt` column or rely on an existing one.

2. **Edit Implications:**
   - **Decision:** Include a UI warning.
   - **Rationale:** Changing the table number regenerates the `qrCodeSignature`. The user must be explicitly warned that "Changing the table number will invalidate existing printed QR codes."

3. **Copy Link Content & Placement:**
   - **Decision:** Absolute URL.
   - **Rationale:** Users need the full URL to share or test on different devices. The link will be displayed visibly next to a "Copy" button.

4. **Bulk Actions:**
   - **Decision:** Include bulk deletion.
   - **Rationale:** Adding bulk deletion improves the UX for larger restaurants and demonstrates robust UI state management.

## Next Steps
Proceed to draft the `plan.md`.