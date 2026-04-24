# Technical Roadmap: Admin Itemized Order View

## I. Architectural Alignment
- **UI Pillar:** Adheres to "Transactional Mode" by increasing information density while maintaining the Apple-inspired precision hierarchy.
- **Structure Pillar:** Updates the core admin dashboard component to fulfill its role as a high-density retail coordination block.

## II. Data Model & Schema Changes
- **API Contract Update:**
  - `GET /api/admin/orders` will now return an array of objects where each order contains an `items` array.
  - Each item in the `items` array will include `quantity`, `dishName` (joined from `dishes`), and `notes`.

## III. Atomic Task List

### API & Data Fetching
- [x] **Task 1: Relational API Enhancement**
    > **Detailed Summary:** Refactor `src/app/api/admin/orders/route.ts`. Use Drizzle's relational query API or an explicit join to fetch `orderItems` for every order. Ensure dish names are included via a join with the `dishes` table. The resulting JSON should match the structure expected by the frontend.

### Frontend Implementation
- [x] **Task 2: Interface Synchronization**
    > **Detailed Summary:** Update the `Order` interface in `src/components/OrdersClient.tsx` to include an optional `items` array. Each item should have `id`, `quantity`, `dishName`, and `notes`.

- [x] **Task 3: Kanban Card Refinement**
    > **Detailed Summary:** Update `DraggableOrderCard` in `src/components/OrdersClient.tsx`. Add a section below the order header to map through `order.items`. Use the "Micro UI" typographic style (12px, tracking -0.12px) as defined in `ui.md` for the items list.

- [x] **Task 4: Drag Overlay Synchronization**
    > **Detailed Summary:** Ensure the `DragOverlay` in `src/components/OrdersClient.tsx` also renders the item list (or a condensed version) to maintain visual continuity during repositioning.

## IV. Critical Path & Dependencies
1. **Task 1** is a strict blocker for Task 2 and 3 as it provides the necessary data.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Data Integrity** | API Request | `GET /api/admin/orders` returns orders with nested `items` array. |
| **Visual Density** | Manual Inspection | Kanban cards show itemized lists with correct quantities and names. |
| **Real-time Sync**| WebSocket Event | New orders appearing via WS also show their itemized contents instantly. |
| **UI Stability**   | Stress Test | Cards remain draggable and responsive even with 5+ items in the list. |
