## Surgical Repair: Apply Optimistic UI & Toast to Menu Management

**Issue:** The user noticed that while `OrdersClient` has full optimistic UI with `sonner` error toasts and state reversion for drag-and-drop, the `MenuAdminClient` drag-and-drop only has a partial optimistic update without proper error handling, state reversion, or visual toast notifications upon failure.

- [x] task 3 - Menu Admin Drag and Drop Parity
  > **Summary:** Refactor `MenuAdminClient.tsx` to match the exact same robust optimistic update pattern established in `OrdersClient.tsx`. 
  > 1. Import `toast` from `sonner`.
  > 2. In `handleDragEnd`, capture the `previousMenu` state before applying the optimistic update.
  > 3. Wrap the `fetch` call in a `try/catch` block.
  > 4. If the fetch fails (`!res.ok` or error thrown), catch the error, revert the state using `setMenu(previousMenu)`, and trigger a `toast.error('Failed to move item. Please try again.')`.