# Technical Roadmap: Customer Order Tracking

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (React Client Components).
- **Real-Time Strategy:** Follows the **Optimized Polling** strategy defined in `tangram/design/architecture.md`.
- **Security Pillar:** The table signature (HMAC) must be provided in the tracking request to ensure customers can only see orders for their specific table.
- **User Prompt:** "Don't you think it would be better that customer can also see what they are currently ordering and the status?"

## II. Data Model & Schema Changes
- **No Database Schema changes.** Reuses existing `orders` and `orderItems` tables.
- **API Contract Extension:** `/api/customer/orders` (GET) will be implemented to filter by `tableId` and `tenantId`.

## III. Atomic Task List

### Backend API Layer
- [x] **Task 1: Implement Customer Orders GET API**
  > **Detailed Summary:** Modify `src/app/api/customer/orders/route.ts` to add a `GET` handler. 
  > - **Parameters:** Accept `tenantId`, `tableId`, and `signature` in search params.
  > - **Validation:** Re-verify the HMAC signature for the table to prevent unauthorized order tracking.
  > - **Query:** Fetch all orders for the `tableId` with a status that is NOT 'completed' or 'cancelled'. Include `orderItems` in the response (either by joining or separate query).

### UI Presentation Layer
- [x] **Task 2: Implement Order Tracking UI in Customer Menu**
  > **Detailed Summary:** Modify `src/components/CustomerMenuClient.tsx`.
  > - **State:** Add a new state variable `activeOrders` to store fetched orders.
  > - **Polling Logic:** Use a `useEffect` hook to poll the new `GET /api/customer/orders` endpoint every 15 seconds while the page is active.
  > - **Visual Component:** Create an "Active Orders" section (collapsible or at the top) that lists items currently in 'pending', 'preparing', or 'served' status. Use visual indicators (e.g., status badges) to show progress.
  > - **Refinement:** Ensure that when a new order is successfully placed, the polling is triggered immediately to refresh the view.

## IV. Critical Path & Dependencies
1. Task 1 (API) must be completed before Task 2 (UI) can fetch real data.
2. Polling frequency should be balanced with Cloudflare D1 read limits (15s is a safe MVP starting point).

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **API Validation** | Script/Manual Test | Requesting orders with an invalid signature returns `403 Forbidden`. |
| **Data Accuracy** | Manual Browser Test | Orders placed via the customer UI appear in the tracking section with the correct items and 'pending' status. |
| **Real-Time Sync** | Manual Browser Test | Updating an order status in the Staff Dashboard (Admin) is reflected on the Customer page within the polling interval. |
| **Multi-Order Support** | Manual Browser Test | Placing a second order from the same table results in both orders being displayed in the tracking UI. |