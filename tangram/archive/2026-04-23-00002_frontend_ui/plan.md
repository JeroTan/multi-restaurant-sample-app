# Technical Roadmap: Frontend UI

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (React Server Components + Client Components) with Tailwind CSS.
- **UI Design Pillar:** Follows the 8px base spacing scale, `rounded-xl` (12px) soft aesthetics, and strict responsive targets (Mobile-first for Customer H5, Desktop-first for Admin).
- **User Prompt:** "Now time for the ui please build it and please check that it works too okay"

## II. Data Model & Schema Changes
- **No Database Schema changes.** The UI will consume the REST APIs established in the `00001_backend_core` feature.

## III. Atomic Task List

### UI Foundation & Routing
- [x] **Task 1: Next.js Layouts & Route Groups**
  > **Detailed Summary:** Setup the Next.js `(customer)` and `(admin)` route groups within `src/app`. Create basic `layout.tsx` files for each to apply distinct structural styling (e.g., full screen mobile view for customers, sidebar layout for admins). Add basic Tailwind global styles.

### Customer H5 Experience
- [x] **Task 2: Customer Menu Page Component**
  > **Detailed Summary:** Create `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx`. This page will fetch the restaurant's menu via `GET /api/customer/menu?tenantId=...`. It will render a scrolling list of categories and dishes. Includes a URL search parameter `?sig=` for the HMAC signature.

- [x] **Task 3: Customer Cart & Checkout Logic**
  > **Detailed Summary:** Implement a client-side Cart state (using React `useState` or Context). Add a floating "View Cart" button that opens a modal/drawer. Implement the "Place Order" button which calls `POST /api/customer/orders` with the payload and URL signature. Handle success/error feedback.

### Admin & Staff Experience
- [x] **Task 4: Admin Sidebar & Navigation**
  > **Detailed Summary:** Create an Admin Navigation component for `src/app/(admin)/[tenantSlug]/layout.tsx` using `lucide-react` icons. Links will include "Orders" and "Menu".

- [x] **Task 5: Staff Order Board (Live View)**
  > **Detailed Summary:** Create `src/app/(admin)/[tenantSlug]/orders/page.tsx`. Fetch orders via `GET /api/admin/orders`. Display orders in a Kanban-style or list view. Implement polling (e.g., every 5-10 seconds) or a manual refresh button. Add action buttons to change order status (`PATCH /api/admin/orders/[orderId]`).

- [x] **Task 6: Menu Management Interface**
  > **Detailed Summary:** Create `src/app/(admin)/[tenantSlug]/menu/page.tsx`. Display the current menu structure. Add simple forms to create new Categories and Dishes (`POST /api/admin/menu/...`).

### Verification & Polish
- [x] **Task 7: E2E UI Testing & Verification**
  > **Detailed Summary:** Start the local development server. Run a script to generate a valid mock Tenant, Table, and HMAC Signature. Open the browser to the generated Customer URL, add items to the cart, submit the order, and then switch to the Admin URL to verify the order appears and can be completed.

## IV. Critical Path & Dependencies
1. Task 1 (Routing) is the foundation.
2. Tasks 2 & 3 (Customer) and Tasks 5 & 6 (Admin) can be built in parallel.
3. Task 7 (Testing) requires all UI components and the `00001_backend_core` API to be functional.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **FR-02** (Menu Browsing) | Manual Browser Test | Customer page loads categories and dishes cleanly on a mobile viewport. |
| **FR-03** (Cart & Order) | Manual Browser Test | Customer can add dishes, view cart, and submit. Receives a visual success confirmation. |
| **FR-04** (Staff Dashboard) | Manual Browser Test | Staff page displays the submitted order. Clicking "Prepare" updates the status in the UI. |
| **UI Polish** | Visual Inspection | Tailwind classes apply correctly; no broken layouts on desktop or mobile. |