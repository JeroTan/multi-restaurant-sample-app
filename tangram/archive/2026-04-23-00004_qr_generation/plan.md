# Technical Roadmap: QR Code Generation & Tables Dashboard

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (React Client Components).
- **Compute Pillar:** Offloading QR code image generation entirely to the browser (using the existing `qrcode` library or `react-qr-code`). This prevents excessive CPU/memory usage on the Cloudflare Edge Worker, which has strict execution limits.
- **UI Design Pillar:** 8px base scale. Strict usage of Tailwind CSS `@media print` utilities (e.g., `print:hidden`, `print:grid-cols-4`) to build a seamless transition from dashboard to physical printout without needing complex PDF generation libraries on the edge.

## II. Data Model & Schema Changes
- **No Database Schema changes.** The `tables` schema already contains `qrCodeSignature`.
- **API Contract:** Expanding `/api/admin/tables` to support `GET` operations.

## III. Atomic Task List

### Backend API Layer
- [x] **Task 1: Expand Tables API Endpoint**
  > **Detailed Summary:** Modify `src/app/api/admin/tables/route.ts` to include a `GET` function. This handler will extract `tenantId` from the URL search parameters, validate it, and query Drizzle to return all rows from the `tables` table where the `tenantId` matches, ordered by `createdAt` or `tableNumber`.

### UI Presentation Layer
- [x] **Task 2: Admin Navigation Update**
  > **Detailed Summary:** Modify `src/app/(admin)/[tenantSlug]/layout.tsx` to add a new `Link` for the "Tables & QRs" page pointing to `/[tenantSlug]/tables`, using the `QrCode` icon from `lucide-react`. Ensure the `print:hidden` Tailwind class is added to the Sidebar `<aside>` so the navigation doesn't appear in printouts.

- [x] **Task 3: Install SVG QR Library**
  > **Detailed Summary:** Run `npm install react-qr-code` to add a lightweight, dependency-free React SVG QR code renderer, which is far simpler and cleaner for client-side React rendering than raw canvas APIs.

- [x] **Task 4: Create Admin Tables & QR Dashboard Component**
  > **Detailed Summary:** Create `src/app/(admin)/[tenantSlug]/tables/page.tsx` and `src/components/TablesAdminClient.tsx`. 
  > - **Data Fetching:** Poll or fetch the tables using `GET /api/admin/tables`.
  > - **Creation Form:** Include a simple form to add new tables using the existing `POST` API.
  > - **QR Grid & Print Layout:** Render a grid of `react-qr-code` SVGs. The URLs inside the QR codes must dynamically use `window.location.origin` + `/[tenantSlug]/[tableNumber]?sig=[signature]`.
  > - **Print Affordance:** Add a "Print All QR Codes" button that calls `window.print()`. Wrap the grid in Tailwind print utilities so that when printed, only the QR codes, the restaurant name, and the table numbers are visible on the physical paper (hiding headers, forms, and buttons).

## IV. Critical Path & Dependencies
1. Task 1 (API GET) is required for Task 4 to display data.
2. Task 3 must occur before Task 4 is built.
3. Task 2 ensures the page is reachable without typing the URL manually.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **API Support** | Browser/Script Test | `GET /api/admin/tables?tenantId=...` successfully returns the tenant's tables with signatures. |
| **FR-06** (QR Gen) | Visual Inspection | Admin UI displays visual SVG QR codes mapped accurately to the `[tableNumber]` and signature. |
| **Print Layout** | Manual Browser Test | Triggering the Print dialog correctly hides the admin sidebar, forms, and buttons, showing a clean printable grid of QR codes. |
| **Navigation** | Manual Browser Test | The new "Tables & QRs" link works and highlights properly in the Admin layout. |