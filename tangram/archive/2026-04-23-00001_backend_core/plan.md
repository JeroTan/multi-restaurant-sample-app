# Technical Roadmap: Backend Core

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (Edge Runtime via OpenNext) + Cloudflare D1 + Drizzle ORM.
- **Security Pillar:** Every query MUST enforce the `tenantId` constraint to ensure multi-tenant data isolation. HMAC signatures are used for Table QR validation.
- **User Prompt:** "Start with the backend functionalities first and test each if it is working."

## II. Data Model & Schema Changes
- The schema is already defined in `src/db/schema.ts` (Tenants, Tables, Categories, Dishes, Orders, Order Items).
- We will add a database connection instance in `src/db/index.ts`.
- We will create a robust testing mechanism (e.g., a `.http` file or fetch scripts) to hit the local endpoints sequentially.

## III. Atomic Task List

### Database & Utilities
- [x] **Task 1: Drizzle DB Instantiation**
  > **Detailed Summary:** Create `src/db/index.ts`. It will initialize the Drizzle client using the `process.env.DB` binding (Cloudflare D1). We will also apply the initial migration to the local D1 instance using `npm run db:migrate`.

### API Layer - Admin/Staff Operations
- [x] **Task 2: Tenant & Table API (Onboarding & QR)**
  > **Detailed Summary:** Create `src/app/api/admin/tenants/route.ts` to register a mock tenant. Create `src/app/api/admin/tables/route.ts` to bulk-generate tables for a tenant. This endpoint will utilize the `signTableUrl` utility from `src/lib/utils.ts` to generate the secure HMAC signature for each table and store it in D1.

- [x] **Task 3: Menu Management API (Categories & Dishes)**
  > **Detailed Summary:** Create `src/app/api/admin/menu/categories/route.ts` and `src/app/api/admin/menu/dishes/route.ts`. Implement `POST` and `GET` handlers. All operations MUST require a `tenantId` payload/header to enforce strict data isolation.

- [x] **Task 4: Order Management API (Staff View)**
  > **Detailed Summary:** Create `src/app/api/admin/orders/route.ts` to fetch all active orders for a specific `tenantId` (polling endpoint). Create `src/app/api/admin/orders/[orderId]/route.ts` with a `PATCH` method to allow staff to update the order status (`pending` -> `preparing` -> `served`).

### API Layer - Customer Operations
- [x] **Task 5: Customer Ordering API**
  > **Detailed Summary:** Create `src/app/api/customer/menu/route.ts` (GET) to fetch a tenant's menu based on `tenantId`. Create `src/app/api/customer/orders/route.ts` (POST) to allow customers to submit an order. This endpoint MUST validate the HMAC signature of the table before accepting the order to prevent forgery.

### Verification Implementation
- [x] **Task 6: Empirical API Verification**
  > **Detailed Summary:** Create a testing script `scripts/test-backend.js` (or a `.http` REST client file) that sequentially executes: Create Tenant -> Create Tables -> Create Category -> Create Dish -> Submit Order (validating HMAC) -> Update Order Status. This ensures every piece of functionality is empirically tested against the local D1 instance as requested by the user.

## IV. Critical Path & Dependencies
1. Task 1 (DB initialization and migration) is the strict blocker for all API tasks.
2. Tasks 2 & 3 must precede Task 5 (Customer cannot order if there are no tables or dishes).
3. Task 6 serves as the "Definition of Done" for this entire phase.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **FR-06** (QR Generation) | Manual / Script Test | API successfully returns table IDs and valid HMAC signatures. |
| **FR-05** (Menu CRUD) | Script Test | Dish is successfully saved to D1, linked to a Category and Tenant. |
| **FR-01** (Secure Ordering) | Script Test | Submitting an order without a valid HMAC signature returns `403 Forbidden`. |
| **FR-04** (Order Status) | Script Test | Updating order status reflects correctly when querying the staff order endpoint. |
