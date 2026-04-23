# Technical Roadmap: Admin & Staff Real-Time Sync

## I. Architectural Alignment
- **Stack Pillar:** Cloudflare Durable Objects + WebSockets.
- **Design Pattern:** "Tenant Hub" - A single DO instance per restaurant to coordinate all real-time events.
- **User Prompt:** "websocket in the admin side... see also realtime update of who is ordering"

## II. Data Model & Schema Changes
- **No Database Schema changes.**
- **Routing Change:** WebSocket connections will now be routed based on `tenantId` instead of `tableId`.

## III. Atomic Task List

### Refactoring Layer (Tenant Hub)
- [x] **Task 1: Refactor Durable Object for Tenant-Wide Broadcasting**
  > **Detailed Summary:** Modify `src/db/order-sync-do.ts`. Rename the class to `TenantOrderBus` (or keep as `OrderSync` but change logic). Ensure it broadcasts messages generically. The notification logic should now handle both "new-order" and "status-update" event types.

- [x] **Task 2: Update Worker Routing to Tenant-Level**
  > **Detailed Summary:** Modify `src/worker.ts`. Update the `/ws` interception logic to expect a `tenantId` query parameter. Route the request to a Durable Object instance unique to that `tenantId`.

### Backend API Layer
- [x] **Task 3: Notify Hub on New Orders**
  > **Detailed Summary:** Modify `src/app/api/customer/orders/route.ts` (POST). After successfully inserting a new order, get the Durable Object instance for the `tenantId` and call `/notify` with a `type: "new-order"` payload.

- [x] **Task 4: Notify Hub on Status Updates**
  > **Detailed Summary:** Modify `src/app/api/admin/orders/[orderId]/route.ts` (PATCH). Ensure the notification payload includes the `tableId` so that connected customers can filter the update.

### UI Presentation Layer
- [x] **Task 5: Integrate WebSocket in Staff Order Board**
  > **Detailed Summary:** Modify `src/components/OrdersClient.tsx`. Implement a WebSocket hook that connects to `/ws?tenantId=...`. On any message, trigger `fetchOrders()` to refresh the live dashboard immediately. Add an "Auto-updating" badge to the UI.

- [x] **Task 6: Update Customer UI Routing**
  > **Detailed Summary:** Modify `src/components/CustomerMenuClient.tsx`. Update the WebSocket connection URL to use `tenantId` instead of `tableId`. Implement local filtering so the UI only refreshes if the received message matches the customer's `tableId` (for status updates) or if it's a relevant global event.

## IV. Critical Path & Dependencies
1. Task 1 & 2 establish the new routing foundation.
2. Task 3 & 4 ensure events are actually being fired from the backend.
3. Task 5 & 6 connect the visual interfaces to the new event stream.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Admin Real-Time** | E2E Manual Test | Placing an order on the Customer H5 reflects on the Admin Order Board INSTANTLY without polling delay. |
| **Customer Filtering** | E2E Manual Test | Updating an order for Table A does NOT trigger a refresh/flicker for a customer sitting at Table B. |
| **Unified Hub** | Network Tab Check | Both Admin and Customer connect to a WebSocket URL using the same `tenantId` parameter. |
