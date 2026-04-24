# Technical Roadmap: Admin Order Drag-and-Drop

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (Edge Runtime). Implementation will use `@dnd-kit/core` and `@dnd-kit/utilities` for lightweight, modular drag-and-drop support.
- **UI Pillar:** 
    - Card radius locked at `rounded-xl` (12px).
    - Elevation: Cards use `shadow-sm` (Surface 1). During drag, active items will transition to `shadow-md` or `shadow-xl` (Surface 2) with a slight scale effect.
    - Transitions: 200ms ease-in-out for drag-and-drop feedback.
- **Security Pillar:** Drag operations will trigger the existing `PATCH /api/admin/orders/[orderId]` endpoint, ensuring that multi-tenancy (`tenantId`) is verified server-side.

## II. Data Model & Schema Changes
- No schema changes required. The `status` field in the `orders` table remains the primary state differentiator.
- The `updateStatus` API contract remains unchanged.

## III. Atomic Task List

### Setup & Library Integration
- [x] **Task 1: Install Drag-and-Drop Dependencies**
    > **Detailed Summary:** Install `@dnd-kit/core` and `@dnd-kit/utilities` via npm. These libraries are optimized for React and maintain high performance in Edge environments.

### Component Refactoring
- [x] **Task 2: Implement Droppable Status Columns**
    > **Detailed Summary:** Create a `StatusColumn` wrapper component inside `OrdersClient.tsx` that uses `useDroppable`. This will allow each of the three columns (Pending, Preparing, Served) to accept dragged order cards.

- [x] **Task 3: Implement Draggable Order Cards**
    > **Detailed Summary:** Wrap the existing order card logic into a `DraggableOrderCard` component using `useDraggable`. Ensure that click handlers on the "Action" buttons (e.g., "Start Preparing") still work correctly by using `dnd-kit`'s sensor configuration (e.g., PointerSensor with activation constraint) to prevent interference with standard button clicks.

### Logic & Synchronization
- [x] **Task 4: Implement Drag Handling Logic**
    > **Detailed Summary:** Implement `handleDragEnd` in `OrdersClient.tsx`. When a card is dropped into a column, check if the status has changed. If so, call the existing `updateStatus(orderId, newStatus)` function. This maintains consistency with the real-time Durable Object sync.

- [x] **Task 5: Add Visual Feedback (The "Pro Max" Touch)**
    > **Detailed Summary:** Use `DragOverlay` to show a smooth, semi-transparent preview of the card while dragging. Implement CSS transitions for column hover states (e.g., a subtle background color shift in `bg-gray-100`) to guide the user.

## IV. Critical Path & Dependencies
1. **Task 1** (Installation) is the entry point.
2. **Tasks 2 & 3** must be implemented together to enable functional dragging.
3. **Task 4** is required to save changes to the database.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **D&D Interaction** | Manual Interaction | Order card moves from one column to another when dragged and dropped. |
| **Click Integrity** | Manual Click | Clicking "Start Preparing" still updates the order status immediately without dragging. |
| **Data Persistence** | Manual Refresh | After dragging a card to a new column and refreshing, the card remains in the new column. |
| **Real-time Sync** | Manual Multi-browser | Dragging an order in Browser A updates the column position in Browser B within 5 seconds. |
| **UI Standards** | Visual Inspection | Cards show elevation change (`shadow-md`) and scale when active. |
