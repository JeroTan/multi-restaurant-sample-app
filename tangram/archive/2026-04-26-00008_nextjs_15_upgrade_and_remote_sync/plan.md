# Technical Roadmap: Next.js 15 Upgrade & Remote Sync

## I. Architectural Alignment
- **Stack Pillar**: Upgrades core framework to Next.js 15 and React 19. Requires moving from synchronous to asynchronous request APIs (P0 constraint). Upgrades `@opennextjs/cloudflare` to maintain adapter compatibility.
- **Security Pillar**: Maintains multi-tenant isolation by ensuring the `admins` table and associated middleware logic are correctly deployed to remote.
- **Deployment Pillar**: Leverages the latest OpenNext Cloudflare adapter features. Migration must ensure `src/worker.ts` correctly delegates to the new Next.js 15 bundle.

## II. Data Model & Schema Changes
- **Remote Synchronization**: No new tables, but `0003_admin_auth` (Admin schema) and previous `0001`/`0002` (Soft Delete) must be applied to the **Remote** D1 database to match the local environment.

## III. Atomic Task List

### Infrastructure & Dependencies
- [x] **Task 1: Remote Database Migration**
    > **Detailed Summary:** Execute `npm run db:migrate:remote` to apply all pending migrations to the Cloudflare D1 production instance. Verify table existence via `wrangler d1 execute`.
- [x] **Task 2: Dependency Bump (Next.js & OpenNext)**
    > **Detailed Summary:** Update `package.json` dependencies: `next@latest`, `react@rc`, `react-dom@rc`, `@opennextjs/cloudflare@latest`. Update devDependencies for `@types/react` and `@types/react-dom`. Run `npm install` and resolve peer dependency conflicts.

### Backend & API Migration
- [x] **Task 3: Async Server Primitives Refactor**
    > **Detailed Summary:** Refactor all dynamic routes (e.g., `src/app/(customer)/[tenantSlug]/[tableNumber]/page.tsx`) to await `params`. Update all API routes using `cookies()` or `headers()` (e.g., `src/app/api/admin/auth/login/route.ts`) to await these calls.
- [x] **Task 4: Custom Middleware Alignment**
    > **Detailed Summary:** Update `src/worker-middleware.ts` to ensure it correctly handles the `env` object from the custom worker instead of relying on `process.env` (which may be unreliable in Next.js 15 edge runtime).

### Frontend Refinement
- [x] **Task 5: React 19 Hook Migration**
    > **Detailed Summary:** Replace `useFormState` with `useActionState` in all authentication forms (`login`, `register`, `forgot-password`). Ensure the `pending` state is correctly utilized from the new hook return signature.

## IV. Critical Path & Dependencies
1. **Task 1 (Remote Sync)** is independent but required for production verification.
2. **Task 2 (Deps)** is the blocker for all subsequent code changes.
3. **Task 3 (Async Primitives)** is the most widespread change and must be completed before the build will pass.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Remote Schema Sync** | CLI Audit | `wrangler d1 execute multi-restaurant-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"` returns `admins`. |
| **Build Success** | Build Command | `npm run build:worker` completes without type errors or EBUSY locks. |
| **Runtime Auth** | Manual Test | Login to `/auth/login` on the remote environment (if deployed) or preview build. |
| **Async Params** | Manual Test | Navigating to `/[tenantSlug]/menu` correctly resolves the slug and displays dishes. |
| **React 19 Forms** | UI Check | Auth forms display loading states and handle errors using `useActionState`. |
