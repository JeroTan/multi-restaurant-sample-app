# Feature Summary: Robust Table Resolution & Ordering Flow

## Intent
To resolve the reported issue where newly created tables in the Admin dashboard cannot be accessed by customers to place orders. This feature will improve the robustness of the table lookup logic and ensure signature validation is consistent across the environment.

## Scope
- **Server-Side Lookup Fix:** Ensure that `tableNumber` parameters from the URL are correctly decoded and matched against the database (handling potential string/number or URL-encoding mismatches).
- **Graceful Error Handling:** Provide better feedback or redirects if a table is not found, rather than a generic 404.
- **Environment Consistency:** Verify that the `JWT_SECRET` used for table signatures is consistent between the creation and validation phases, especially in the Cloudflare D1 environment.

## Strategic Fit
This feature addresses a critical path blocker for the core product value (**FR-01: QR Scan & Menu**). Ensuring that any generated table QR code correctly leads to a functional menu is essential for the application's usability and reliability.

## Execution Log
- Pace: All-at-Once
- Implemented `decodeURIComponent` on the `tableNumber` parameter in `CustomerPage` to handle encoded characters in URLs (e.g., spaces or dashes).
- Added structured logging to `CustomerPage` and `POST /api/customer/orders` to track resolution failures and signature mismatches.
- Verified that `JWT_SECRET` fallback logic is consistent across the creation and validation layers.
- Confirmed type safety with `npx tsc`.

## Final Execution Log
- **What was Built**: Robust table lookup logic in the customer menu page and enhanced signature validation logging in the ordering API.
- **Challenges & Fixes**: Addressed a bug where special characters in table names caused database lookup failures by implementing URL decoding on the server-side parameter.
- **Design Adherence**: The fix reinforces the Security Pillar (HMAC integrity) while improving the reliability of the system's core user journey.