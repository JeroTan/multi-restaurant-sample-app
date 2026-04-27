# Technical Roadmap: Optimistic UI & Error Notifications for Kanban

## I. Architectural Alignment
- **UI Pillar**: Adheres to the "Precision Dining" feeling by removing UI latency during drag-and-drop interactions, creating a seamless and snappy experience. Uses `sonner` for modern, stacked toast notifications.
- **Stack Pillar**: Leverages `sonner` as a lightweight, zero-dependency, and highly compatible standard for Next.js app router notifications.

## II. Data Model & Schema Changes
- No database schema changes required.

## III. Atomic Task List

### Configuration Layer
- [x] **Task 1: Install Notification Library**
    > **Detailed Summary:** Run `npm install sonner` to add the modern toast notification library to the project dependencies.

### UI Layer
- [x] **Task 2: Configure Global Toaster**
    > **Detailed Summary:** Modify `src/app/layout.tsx`. Import `Toaster` from `sonner` and place `<Toaster position="top-right" richColors />` within the `<body>` tag, ensuring toasts can be displayed globally across the application.
- [x] **Task 3: Implement Optimistic Drag & Drop in OrdersClient**
    > **Detailed Summary:** Modify `src/components/OrdersClient.tsx`. 
    > 1. Import `toast` from `sonner`.
    > 2. Refactor the `updateStatus` `useCallback`.
    > 3. Instead of waiting for the `fetch` to complete before updating the UI, immediately update the `orders` state using `setOrders(prev => ...)`. Capture the `previousOrders` state before the mutation.
    > 4. Perform the `PATCH` API request.
    > 5. If `!res.ok` or an exception is thrown, catch the error, revert the state using `setOrders(previousOrders)`, and display an error notification using `toast.error('Failed to update order status. Please try again.')`.

## IV. Critical Path & Dependencies
- Task 1 (`sonner` installation) is a hard blocker for Tasks 2 and 3.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Instant Feedback** | Manual UI Interaction | Dragging an order or clicking a status button immediately updates the UI without network delay. |
| **Error Handling & Revert** | Network Throttling / Error Simulation | Simulating an API failure (e.g. throwing an error in the route or blocking the request) causes the dragged order to snap back to its original column, accompanied by a red `sonner` error toast. |
