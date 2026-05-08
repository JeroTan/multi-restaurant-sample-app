# Debug Log: 00013_debug_001

## Issue Overview
Despite the centralization of signature logic, the "Invalid table signature" error persists. The server-side verification fails, suggesting a mismatch in either the `JWT_SECRET` used, the data format being signed, or environment-specific inconsistencies between the Admin API (Table Creation) and Customer API (Order Submission).

## Diagnostic Steps
1. **Log Data Format**: Verify exactly what string is being encoded for signing (e.g., `tenantId:tableNumber`).
2. **Secret Verification**: Log a masked version of the `JWT_SECRET` to ensure it's not falling back to an unexpected value.
3. **Compare Signatures**: Log the expected signature alongside the received one for direct comparison.

## Fixing Checklist

- [ ] task 2.2 - [Signature Mismatch in Customer API]
  > **Summary:** Add verbose diagnostic logging to `src/app/api/customer/orders/route.ts`. Log the exact string passed to the signer, a masked version of the secret (e.g., first and last 2 characters), and the re-calculated signature. This will help identify if the issue is a secret mismatch or a data format mismatch.

- [ ] task 3.1 - [Signature Mismatch in Websocket Handshake]
  > **Summary:** Similar to the API, add diagnostic logging to the `/ws` interceptor in `src/worker.ts` to ensure consistency.

- [ ] task 1.1 - [Signature Robustness]
  > **Summary:** Ensure `signTableSignature` handles potential edge cases like whitespace or different ID formats consistently.
