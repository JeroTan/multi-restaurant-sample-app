# Technical Roadmap: Admin Authentication & Authorization

## I. Architectural Alignment
- **Security Pillar**: Implements JWT-based authentication via HTTP-only cookies. Adheres to multi-tenant isolation by scoping admins to specific `tenantId`s.
- **Stack Pillar**: Leverages `jose` for edge-compatible JWT operations and `resend` for transactional emails within the Cloudflare Worker environment.
- **UI Pillar**: Follows the Apple-inspired design for authentication pages, prioritizing precision typography and clean high-contrast layouts.

## II. Data Model & Schema Changes
- **New Table: `admins`**
    - `id`: text PRIMARY KEY.
    - `tenantId`: text references `tenants.id`.
    - `name`: text NOT NULL.
    - `email`: text UNIQUE NOT NULL.
    - `passwordHash`: text NOT NULL.
    - `resetToken`: text.
    - `resetExpires`: integer (timestamp).

## III. Atomic Task List

### Backend & Infrastructure
- [x] **Task 1: Admin Schema & Migration**
    > **Detailed Summary:** Update `src/db/schema.ts` with the `admins` table definition. Create and apply migration `0003_admin_auth.sql`.
- [x] **Task 2: Auth API Implementation**
    > **Detailed Summary:** Created `register`, `login`, and `logout` routes. Registration creates both tenant and admin. Login sets secure HTTP-only cookie with JWT.
- [x] **Task 3: Password Reset Flow**
    > **Detailed Summary:** Implemented `forgot-password` (Resend integration) and `reset-password` routes with secure token validation.
- [x] **Task 4: Next.js Middleware Guard**
    > **Detailed Summary:** Created `src/middleware.ts` to protect admin pages and APIs. Includes cross-tenant access prevention.

### Frontend Implementation
- [x] **Task 5: Auth UI Components**
    > **Detailed Summary:** Built Login, Register, Forgot Password, and Reset Password pages with Apple-inspired design and password visibility toggles.
- [x] **Task 6: Tenant Onboarding Integration**
    > **Detailed Summary:** Updated `CreateDemoButton.tsx` and the landing page to integrate the new authentication system.

## IV. Critical Path & Dependencies
1. **Task 1** is a hard blocker for all data operations.
2. **Task 4 (Middleware)** should be implemented alongside UI to ensure a smooth "Redirect to Login" experience.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Secure Registration** | Manual Test | New record in `admins` table with hashed password (no plain text). |
| **JWT Authorization** | API Audit | Accessing protected API without cookie returns 401. |
| **Tenant Isolation**  | Manual Test | Admin for "Burger King" cannot visit `/admin/mcdonalds`. |
| **Password Visibility** | UI Check | Toggle button switches input type between `password` and `text`. |
| **Email Delivery** | Integration | Resend log shows successful delivery of reset email. |
| **Edge Compatibility**| Build Command | `npm run build` succeeds (no Node.js-only crypto usage). |
