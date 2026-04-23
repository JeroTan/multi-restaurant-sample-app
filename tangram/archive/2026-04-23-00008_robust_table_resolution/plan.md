# Technical Roadmap: Robust Table Resolution

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (Server Components) + Drizzle ORM.
- **Security Pillar:** HMAC-signed table URLs (Security NFR).
- **User Prompt:** "If I add new table in admin and use it I cannot open the page and make order lol"

## II. Data Model & Schema Changes
- **No Schema changes.** The issue lies in the logic of retrieving and comparing existing data.

## III. Atomic Task List

### UI & Server Logic Layer
- [x] **Task 1: Sanitize and Robustify Table Lookup**
  > **Detailed Summary:** Modify `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx`. Implement URL decoding for the `tableNumber` parameter using `decodeURIComponent` to ensure that tables with special characters or spaces in their names (e.g., "Patio 1") are correctly resolved from the dynamic route. Add logging to debug potential lookup failures during development.

- [x] **Task 2: Synchronize JWT Secrets**
  > **Detailed Summary:** Ensure that the `JWT_SECRET` is correctly managed. Currently, it falls back to 'fallback-secret'. We need to ensure that the environment configuration in `wrangler.jsonc` (or via Cloudflare Secrets) is actually being picked up by the build process so that signatures generated in Admin match those validated by the Customer API.

- [x] **Task 3: Improved Signature Verification Feedback**
  > **Detailed Summary:** Modify `src/app/api/customer/orders/route.ts` to provide clearer log output when a signature mismatch occurs, helping administrators diagnose if the issue is a secret mismatch or a data integrity issue.

## IV. Critical Path & Dependencies
1. Task 1 is the most likely fix for "cannot open the page".
2. Task 2 and 3 ensure that once the page *is* open, the order can actually be *placed*.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Table Lookup** | Manual Browser Test | Creating a table with a special name (e.g., "A-1") in Admin and clicking its QR link correctly opens the customer menu. |
| **Order Flow** | Manual Browser Test | After opening the menu for a new table, an order can be submitted successfully without 403 Forbidden errors. |
| **Secret Integrity** | Code Review | Verified that the same secret/fallback logic is used in both `signTableUrl` calls and validation endpoints. |