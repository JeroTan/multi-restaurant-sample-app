# Debug Log: 002 - Frontend Regression Repair (WS, Logs, & Immersion)

## Overview
The UI Overhaul introduced several frontend regressions that broke existing functionality. The user reports that the WebSocket and Database were 100% working prior to the refactor. This debug session focuses on restoring that state while maintaining the new visual standards.

## Diagnostic Findings
1. **WebSocket Port Mismatch**: In development, `window.location.host` (Port 3000) does not handle the `/ws` endpoint. The worker (Port 8787) is the true target.
2. **Missing Order Logs**: The `DraggableOrderCard` refactor omitted the list of order items, making the Kanban useless for fulfillment.
3. **Immersion Break**: `window.alert` is being used for order confirmation, violating the Apple-inspired "Guest" UX.
4. **API Regression**: The `GET /api/admin/orders` route is returning a 500 error, likely due to the JOIN logic crashing the Edge runtime.

---

- [x] task 4 - [Fix] Restore WebSocket Connectivity & Order Logs
    > **Summary:** Updated `src/components/OrdersClient.tsx` to handle the correct port (8787) in development. Restored `OrderItem` display to Kanban cards and implemented a robust WS reconnection loop.

- [x] task 4 - [Fix] Robust Admin API with Detail Recovery
    > **Summary:** Refactored `src/app/api/admin/orders/route.ts` with `try/catch` error boundaries and implemented a joined query to fetch `orderItems` for each order, restoring the "logs" requested by the user.

- [x] task 5 - [Fix] Replace alerts with Immersive Notifications
    > **Summary:** Removed all `window.alert` calls from `CustomerMenuClient.tsx`. Implemented an inline Apple-style "Toast" notification state for success and error feedback.
