# Technical Roadmap: Admin Dish CRUD Refinement

## I. Architectural Alignment
- **UI Pillar**: Adheres to the "Transactional Mode" guidelines from `ui.md`, focusing on high-density utility and precision controls.
- **Security Pillar**: Ensures all updates and deletions are scoped by `tenantId` to maintain strict multi-tenant isolation.
- **Stack Pillar**: Leverages Next.js dynamic routing and Drizzle ORM for surgical database updates.

## II. Data Model & Schema Changes
- **API Contract Update**:
  - `PATCH /api/admin/menu/dishes/[id]`: Updates dish metadata (name, price, description, category, image).
  - `DELETE /api/admin/menu/dishes/[id]`: Removes a dish record from the database.

## III. Atomic Task List

### API Layer
- [x] **Task 1: Dynamic CRUD API**
    > **Detailed Summary:** Create `src/app/api/admin/menu/dishes/[id]/route.ts`. Implement `PATCH` and `DELETE` methods. Use Drizzle's `update` and `delete` functions. **Mandatory**: Include a `where` clause that checks both `id` AND `tenantId` to prevent cross-tenant security breaches.

### UI Layer
- [x] **Task 2: Item Action Triggers**
    > **Detailed Summary:** Update `MenuAdminClient.tsx`. Add "Edit" and "Delete" icons (using Lucide's `Edit3` and `Trash2`) to the dish cards in the Live Preview grid. Use `Apple Action Blue` for edit and a subtle red for delete.

- [x] **Task 3: Refactored Management Form**
    > **Detailed Summary:** Refactored the management logic to support both creation and editing states efficiently within `MenuAdminClient.tsx`.

- [x] **Task 4: Modal Edit Experience**
    > **Detailed Summary:** Implement a modal overlay that appears when "Edit" is clicked. This modal should populate the `DishForm` with the selected dish's current data and handle the `PATCH` request upon submission.

- [x] **Task 5: Delete Confirmation UI**
    > **Detailed Summary:** Implement a precision confirmation state for deletions. Avoid native `window.confirm`; use a state-based UI approach aligned with the Apple aesthetic.

- [x] **Task 6: Drag-and-Drop Category Reassignment**
    > **Detailed Summary:** Integrate `@dnd-kit` into `MenuAdminClient.tsx`. Make category sections "Droppable" and dish cards "Draggable". On `onDragEnd`, if a dish is dropped into a different category, trigger a `PATCH` request to update the `categoryId`. Reuse the `DragOverlay` pattern from `OrdersClient.tsx` for visual continuity.

## IV. Critical Path & Dependencies
1. **Task 1** is a strict blocker for all UI integration.
2. **Task 3** must be completed before Task 4 to ensure code reusability.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Update Integrity** | API Request | `PATCH` returns the updated dish object with correct values. |
| **Visual Sync** | UI Check | After editing, the Live Preview updates immediately without a full page refresh. |
| **Security Scope** | Manual Audit | A request with valid dish ID but invalid `tenantId` returns a 401/403 error. |
| **Category Shift** | Manual Test | Changing a dish's category moves it to the correct section in the UI. |
