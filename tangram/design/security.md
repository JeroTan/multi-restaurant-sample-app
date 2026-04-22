# Security Blueprint

**Source of Truth:** `.gemini/knowledge/security/auth-protocol.md` + PRD Constraints.

## Authentication (Identity)
- **Strategy:** Edge-compatible JWT Sessions (using `jose` or NextAuth.js configured for the Edge).
- **Flow:** If utilizing an external IdP (like Auth0 for Admin dashboards), we MUST enforce **Authorization Code Flow with PKCE**. Implicit flows are forbidden.

## Authorization (RBAC)
| Role | Access Level |
| :--- | :--- |
| **Customer** | Anonymous session tied to Table URL. Can only append to existing table session. |
| **Staff** | Read/Write access to the Order queue for their specific `restaurant_id`. |
| **Admin** | Read/Write access to Menu, Tables, and Staff for their specific `restaurant_id`. |
| **Super Admin** | Platform-wide read/write for tenant subscriptions. |

## Data Protection & Hardening
- **Multi-Tenancy Guard:** `restaurant_id` must be programmatically injected into all queries; never trust client-provided tenant IDs.
- **QR Integrity:** Table URLs use HMAC signatures (e.g., `?table=5&sig=abc123hash`) to prevent malicious URL manipulation.
