# Business Requirements Document (BRD)

## 1. User Personas & Roles

- **Customer (Dana):** Dine-in user who scans QR codes to browse menus and place orders without app installation.
- **Staff/Cashier (Lily):** Front-of-house worker who receives real-time alerts and manages order status.
- **Restaurant Admin (Tom):** Owner/Manager who maintains menus, manages tables, and generates QR codes.
- **Platform Super Admin:** SaaS operator who reviews restaurant applications and manages subscription tiers.

## 2. Functional Requirements (FR)

| ID    | Requirement | Priority | Description |
| ----- | ----------- | -------- | ----------- |
| FR-01 | QR Scan & Menu | P0 | Automatic identification of Restaurant/Table via HMAC-signed QR URL. |
| FR-02 | Menu Browsing | P0 | Display categories, dishes, variants (size/flavor), and add-ons with photos. |
| FR-03 | Cart & Order | P0 | Supports quantity adjustments, item notes, and "Append to Table" logic. |
| FR-04 | Staff Dashboard | P0 | Real-time order queue with Audio/Visual alerts and status transitions. |
| FR-05 | Menu Management | P0 | CRUD for categories/dishes, image upload, and one-click "Sold Out" toggle. |
| FR-06 | QR Generation | P0 | Bulk table creation and downloadable unique QR codes (PNG/PDF). |
| FR-07 | Multi-tenancy | P0 | Strict data isolation using `restaurant_id` at the database level. |
| FR-08 | Multilingual | P1 | Customer H5 interface toggle for English and Chinese. |
| FR-09 | Subscriptions | P1 | Logic to gate features or dashboard access based on tenant plan status. |

## 3. Non-Functional Requirements (NFR)

- **Performance:** Customer menu page FCP < 2 seconds; Staff notification latency < 5 seconds.
- **Scalability:** Optimized for edge execution via Cloudflare Workers to handle global traffic.
- **Security:** HMAC signature for QR codes to prevent table forgery; RLS-style filtering for multi-tenancy.
- **Availability:** High availability leveraging Cloudflare's global edge network.

## 4. User Journey Summary

A customer scans a table-top QR code which opens a mobile-optimized menu. They select items (including variants/notes), submit the order, and see a confirmation. Restaurant staff instantly see the order on their dashboard, move it through "Preparing" to "Completed," and the customer's page updates in real-time.

## 5. Out of Scope (MVP)

- Online payment processing (WeChat Pay, Stripe, etc.) - Planned for Phase 2.
- Advanced business analytics and reporting.
- Customer loyalty/membership systems.
- Native mobile applications (iOS/Android).
- Automated hardware printer integrations.
