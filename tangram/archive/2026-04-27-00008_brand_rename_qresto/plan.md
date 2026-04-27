# Technical Roadmap: Brand Rename to QResto

## I. Architectural Alignment
- **UI Pillar**: Adheres to branding guidelines. The rename maintains the "Apple-Inspired" aesthetic but replaces the nomenclature.
- **Historical Consistency**: Follows the pattern of previous renames (archive/00007), ensuring no functional code is broken during string replacement.

## II. Data Model & Schema Changes
- No database schema changes required.
- **Default Data**: Update any hardcoded strings used for sample data generation (if any remaining).

## III. Atomic Task List

### UI Layer (Branding)
- [x] **Task 1: Landing Page Update**
    > **Detailed Summary:** Modify `src/app/page.tsx`. Replace "Tangram QR" in the footer and any other sections with "QResto".
- [x] **Task 2: Auth Interface Update**
    > **Detailed Summary:** Update `src/app/auth/login/page.tsx` ("Sign in to QResto") and `src/app/auth/register/page.tsx` ("Join QResto", "Already using QResto?").
- [x] **Task 3: Meta & Title Updates**
    > **Detailed Summary:** Scan `src/app/layout.tsx` or individual page metadata to ensure page titles and descriptions reflect "QResto".

### API & Communications
- [x] **Task 4: Transactional Email Branding**
    > **Detailed Summary:** Modify `src/app/api/admin/auth/forgot-password/route.ts`. Update the `from` field in the Resend email call to use "QResto QR" or similar.

## IV. Critical Path & Dependencies
- This is a non-blocking feature and can be executed as a final polish step.
- All UI tasks can be performed in parallel.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **UI Consistency** | Grep Search | `grep -r "Tangram" src/` returns 0 user-facing results. |
| **Auth Experience** | Manual Visual Check | Login/Register pages display "QResto". |
| **Email Sender** | Integration Test | Password reset email shows "QResto" as the sender. |
