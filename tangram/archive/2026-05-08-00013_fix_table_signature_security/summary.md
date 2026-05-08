# Feature Summary: 00013_fix_table_signature_security

## Intent
Resolve the "Invalid table signature" error and associated Websocket live status failures that occur when registering/logging in and in remote Cloudflare environments.

## Scope
- Centralize HMAC signature generation and verification in `src/lib/crypto/signature.ts`.
- Standardize on Web Crypto / `jose` patterns that are guaranteed to work in Cloudflare Workers, moving away from fragmented global `crypto` usage.
- Eliminate the "fallback-secret" vulnerability by enforcing environment variable presence and ensuring consistency between local and remote environments.
- Secure the Websocket connection by requiring a signature or valid session, preventing unauthorized access to the restaurant's real-time hub.
- Update Admin API (Table Creation) and Customer API (Order Submission) to use the new centralized utility.
- Fix `CreateDemoButton` to ensure demo environments remain functional.

## Strategic Fit
- **Security Pillar**: Aligns with the requirement for HMAC-signed QR codes to prevent table forgery.
- **Reliability**: Ensures the core transactional flow (ordering) and real-time updates work consistently across local and production environments.

## Execution Log
- **Crypto Foundation**: Created `src/lib/crypto/signature.ts` with Web Crypto based HMAC utilities.
- **Secret Enforcement**: Added `getRequiredSecret` to `src/lib/cloudflare.ts` to prevent insecure fallbacks.
- **Admin API**: Refactored `src/app/api/admin/tables/route.ts` to use new signature logic.
- **Customer API**: Refactored `src/app/api/customer/orders/route.ts` with enhanced verification logging.
- **Websocket Security**: Updated `src/worker.ts` to verify signatures before upgrading, and updated `CustomerMenuClient.tsx` to pass the required params.
- **Demo Generation**: Updated `CreateDemoButton.tsx` to align with new security standards.
- **Cleanup**: Removed legacy `signTableUrl` from `src/lib/utils.ts`.

## Debugging Log (debug_001.md)
- Added verbose diagnostic logging to `src/app/api/customer/orders/route.ts` and `src/worker.ts` to capture data strings, masked secrets, and signature comparisons.
- Refined `signTableSignature` to trim inputs, preventing common whitespace mismatches.

## Debugging Log (debug_002.md)
- Fixed an issue where customer API routes were being intercepted by admin authentication middleware due to broad wildcard patterns (e.g., `*/orders`).
- Added explicit guards in `src/worker-middleware.ts` to bypass admin session checks for any path starting with `/api/customer` or common customer-facing system routes.
- Tightened Admin Page patterns from `*/orders` to `/*/orders` for better specificity.

## Final Execution Log
- **What was Built**: A robust and secure table signature system centralized in `src/lib/crypto/signature.ts`. The implementation enforces environment secret presence and provides diagnostic logging for remote debugging. Customer-facing routes are explicitly isolated from admin authentication checks in the middleware proxy layer.
- **Challenges & Fixes**: 
  - Encountered signature mismatches in remote environments, resolved via `debug_001.md` by adding verbose logging and trimming input whitespace.
  - Encountered unintended 401/403 errors on customer APIs, resolved via `debug_002.md` by refining middleware matching logic and adding path-based bypass guards.
- **Design Adherence**: Strictly followed the **Security Pillar** (HMAC integrity + authenticated Websockets) and the **Stack Pillar** (Cloudflare Worker compatible Web Crypto).
