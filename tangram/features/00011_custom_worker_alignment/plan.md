# Technical Roadmap: Custom Worker Alignment

## I. Architectural Alignment
- **Compute Pillar:** Custom Worker Entry Point.
- **Reference:** https://opennext.js.org/cloudflare/howtos/custom-worker
- **User Prompt:** "align with the actual documents... try this to see if it works and test please"

## II. Data Model & Schema Changes
- **No Database Schema changes.**
- **Routing:** Maintains the custom `/ws` interception for Durable Objects.

## III. Atomic Task List

### Refactoring Layer
- [x] **Task 1: Align `src/worker.ts` with Documentation Pattern**
  > **Detailed Summary:** Modify `src/worker.ts`. 
  > - Change the import of the Next.js bundle to `import { default as handler } from "../.worker-next/index.mjs";`.
  > - Update the default export to use `handler.fetch` while maintaining the custom logic for WebSocket upgrades on the `/ws` path.
  > - Explicitly export `OrderSync` as a named export (required by Cloudflare) but also include it in the default export object to mirror the documentation's suggested structure.

### Verification Layer
- [x] **Task 2: Build and Test Real-Time Connectivity**
  > **Detailed Summary:** 
  > - Run `npm run build:worker` to regenerate the bundle.
  > - Start `npm run dev:worker`.
  > - Run a custom test script to verify that:
  >   1. Standard API requests (e.g., `/api/admin/tenants`) are handled by Next.js/OpenNext.
  >   2. WebSocket upgrade requests to `/ws?tableId=...` are correctly handled by the `OrderSync` Durable Object.

## IV. Critical Path & Dependencies
1. Task 1 (Refactor) is the core change.
2. Task 2 (Verification) is mandatory as per user request to ensure alignment didn't break functionality.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Doc Alignment** | Code Review | `src/worker.ts` uses the `import { default as handler }` syntax. |
| **WebSocket Upgrade** | `ws` client test | A WebSocket client can connect to `/ws` and receive a 101 status. |
| **Next.js Delegation** | `fetch` client test | A standard API request returns data from the Next.js app handler. |
| **DO Functionality** | E2E Test | Broadcasting via the DO notifies the connected WebSocket client. |
