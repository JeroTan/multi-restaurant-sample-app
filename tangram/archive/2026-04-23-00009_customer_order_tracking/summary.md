# Feature Summary: Customer Order Tracking

## Intent
To provide customers with real-time visibility into their active orders and their current preparation status. This enhances the dining experience by reducing uncertainty and allowing customers to track multiple orders (e.g., if they order drinks first and food later).

## Scope
- **API Extension:** Adding a `GET` method to `/api/customer/orders` to retrieve active orders for a specific table, restricted by tenant and security validation.
- **UI Enhancement:** A new tracking section in the `CustomerMenuClient` component that displays a list of active orders and their statuses.
- **Real-Time Updates:** Implementing client-side polling on the customer interface to keep order statuses synchronized with the staff dashboard.

## Strategic Fit
This feature directly supports the **User Journey Summary** in the BRD: "the customer's page updates in real-time." It fulfills the implicit requirement for customers to see what they are currently ordering and the status of those items, improving overall transparency and satisfaction.

## Execution Log
- Pace: All-at-Once
- Implemented `GET` handler in `src/app/api/customer/orders/route.ts` with HMAC signature validation to allow secure order tracking per table.
- Added explicit data fetching for order items to ensure correct display of previous orders.
- Enhanced `CustomerMenuClient.tsx` with an "Active Orders" tracking section that polls the API every 15 seconds.
- Integrated `lucide-react` icons and color-coded status badges for a professional UI.
- Type checked successfully.

## Final Execution Log
- **What was Built**: Secure order tracking functionality for customers. Added a validated GET endpoint for table orders and a real-time polling UI section on the menu page that displays active order items and their current status (pending, preparing, served).
- **Challenges & Fixes**: Implemented explicit item fetching per order to ensure correct display of multi-order history, bypassing potential edge-case limitations with simpler ORM queries.
- **Design Adherence**: Strictly followed the project's Optimized Polling strategy for real-time edge sync and the HMAC-based security pillar for data isolation.