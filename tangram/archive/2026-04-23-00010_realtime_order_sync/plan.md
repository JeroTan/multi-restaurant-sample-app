# Technical Roadmap: Real-Time Order Synchronization

## I. Architectural Alignment
- **Stack Pillar:** Cloudflare Durable Objects + WebSockets.
- **Compute Pillar:** Custom Worker Wrapper for OpenNext (as per OpenNext Cloudflare How-to).
- **User Prompt:** "just webscoket is fine... we will update the status of your order automatically... automatic first"
- **Historical Reference:** officially upgrades the polling strategy mentioned in `tangram/design/architecture.md` to a persistent WebSocket architecture.

## II. Data Model & Schema Changes
- **New Entity:** `OrderSync` Durable Object. This class will maintain active WebSocket connections for specific `tableId` groups and broadcast status updates.
- **Wrangler Bindings:** Add `durable_objects` and `migrations` (for DO) to `wrangler.jsonc`.

## III. Atomic Task List

### Architectural Upgrade (WebSocket Implementation)
- [x] **Task 1: Implement Durable Object Class**
  > **Detailed Summary:** Create `src/db/order-sync-do.ts`. Implement a `DurableObject` class that handles `webSocket` message routing. It should allow clients to "subscribe" to a `tableId` and provide a method for the API to "notify" subscribers of a status change.

- [x] **Task 2: Custom Worker Entry Point**
  > **Detailed Summary:** Create `src/worker.ts`. This file will import the bundled Next.js app from `.worker-next/index.mjs` and handle the `fetch` event. It must intercept WebSocket upgrade requests and route them to the `OrderSync` Durable Object. It must also export the `OrderSync` class.

- [x] **Task 3: Update Wrangler & Build Configuration**
  > **Detailed Summary:** 
  > - Update `wrangler.jsonc`: Set `main: "src/worker.ts"`, add `durable_objects` binding, and define the necessary DO migration.
  > - Create/Update `open-next.config.ts` (if needed) or `next.config.mjs` to ensure the build process remains compatible with the custom worker wrapper.

- [x] **Task 4: Integrate WebSocket in Customer UI**
  > **Detailed Summary:** Modify `src/components/CustomerMenuClient.tsx`. 
  > - Implement a WebSocket hook that connects to the server (`/ws`).
  > - On receipt of an "order-update" message, trigger a data refresh. 
  > - **UI Change:** Add the text "We will update the status of your order automatically" in the active orders section to reassure the user.

- [x] **Task 5: Broadcast Updates from Admin API**
  > **Detailed Summary:** Modify `src/app/api/admin/orders/[orderId]/route.ts`. When an order status is updated, get the `OrderSync` Durable Object instance for that table and call its `notify` method to push the update to connected customers via WebSocket.

## IV. Critical Path & Dependencies
1. Tasks 1, 2, and 3 are the foundational work for WebSockets.
2. Task 5 connects the backend state changes to the real-time push mechanism.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **WebSocket Upgrade** | Network Tab Check | The browser establishes a 101 Switching Protocols connection to the worker at `/ws`. |
| **Automatic Status Update** | E2E Manual Test | Updating an order in the Staff Dashboard (Admin) reflects on the Customer page INSTANTLY (< 500ms). |
| **UI Messaging** | Visual Inspection | The text "We will update the status of your order automatically" is clearly visible in the tracking section. |
| **DO Persistence** | Wrangler Log Check | Durable Object instances are correctly created and recycled based on table activity. |
