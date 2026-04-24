# Debug Log: 001 - Drag Overlay Performance Optimization

## Overview
Restaurant staff reported perceived lag or "slowness" when dragging order cards. The diagnostic scan revealed that the parent `OrdersClient` component re-renders the entire order list on every drag state change due to a lack of memoization, causing significant frame drops.

## Diagnostic Findings
1. **Render Cascade**: Every `DraggableOrderCard` and `StatusColumn` re-renders when `activeOrder` state changes.
2. **Redundant Transforms**: Original cards are applying `transform` while also being shadowed by the `DragOverlay`.
3. **Unoptimized Filtering**: `orders.filter()` runs on every render in the main body.
4. **Sensor Instability**: Sensors are redefined on every render without `useMemo`.

---

- [x] task 5 - [Optimization] Eliminate Render Cascade in OrdersClient
    > **Summary:** Refactor `DraggableOrderCard` and `StatusColumn` to use `React.memo`. Move order filtering logic into `useMemo` blocks and wrap the `updateStatus` function in `useCallback`. This prevents the entire dashboard from re-rendering when a single item is grabbed.

- [x] task 5 - [Optimization] Stabilize Drag Overlay & Transforms
    > **Summary:** Disable the CSS `transform` on the original `DraggableOrderCard` while `isDragging` is true, as the `DragOverlay` already handles visual movement. Stabilize the `sensors` configuration using `useMemo`. This reduces the CPU overhead during active drag movements.
