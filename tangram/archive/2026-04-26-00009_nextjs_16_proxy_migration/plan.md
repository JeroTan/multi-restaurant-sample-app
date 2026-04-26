# Technical Roadmap: Next.js 16 Proxy Migration

## I. Architectural Alignment
- **Stack Pillar**: Upgrades to Next.js 16 (Turbopack by default) and React 19.2. Adopts the official `proxy.ts` standard for low-level request interception, IF supported by OpenNext.
- **Deployment Pillar**: Maintains the custom Cloudflare Worker entry point (`src/worker.ts`). The migration must ensure that the OpenNext adapter continues to work with our manual delegation and the new Next.js 15/16 output structure.
- **Security Pillar**: Maintains multi-tenant isolation. The interception layer (Proxy or Sidecar) serves as the gatekeeper for all admin routes.

## II. Data Model & Schema Changes
- **No Schema Changes**: Pure architectural and framework refactor.

## III. Atomic Task List

### Phase 0: OpenNext Compatibility Audit
- [x] **Task 1: Verify Adapter Support for Proxy API**
    > **Detailed Summary:** Confirmed that @opennextjs/cloudflare does not yet support Node.js middleware/proxy (Next.js 16 default). Pivoted to maintaining the Edge-compatible `src/worker-middleware.ts` sidecar.

### Phase 1: Core Upgrade & Codemods
- [x] **Task 2: Framework Upgrade**
    > **Detailed Summary:** Updated `package.json` to Next.js 16.2.4, React 19.2, and ESLint 9.
- [x] **Task 3: Execute Upgrade Codemods**
    > **Detailed Summary:** Ran codemods and verified that `Promise` based props are used correctly.

### Phase 2: Configuration & Logic Porting
- [x] **Task 4: Realignment of `next.config.mjs`**
    > **Detailed Summary:** Enabled stable Turbopack and updated Image TTL/security defaults.
- [x] **Task 5: Port Logic to Interception Layer**
    > **Detailed Summary:** Modernized `src/worker-middleware.ts` to utilize Next.js 16 standards while maintaining Edge runtime compatibility.

### Phase 3: Integration & Cleanup
- [x] **Task 6: Worker & Build Pipeline Realignment**
    > **Detailed Summary:** Updated `src/worker.ts` to call the modernized sidecar. Verified full build success with Turbopack.

## IV. Critical Path & Dependencies
1. **Task 1 (Audit)** determines if we use the official Proxy API or stay with our reliable Worker sidecar.
2. **Task 2 & 3 (Upgrade & Codemods)** are mandatory before manual refactoring.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Framework Version** | `npm list next` | Returns `16.0.0`. |
| **OpenNext Integration** | `npm run build:worker` | Completes successfully and generates `.open-next/worker.js`. |
| **Proxy/Sidecar Interception** | Manual Test | Logs in the interception layer appear in terminal during navigation. |
| **Auth Redirection** | Manual Test | Visiting `/auth/login` while logged in redirects to `/[tenantSlug]/orders`. |
| **Secure API Guard** | `curl` Test | Accessing `/api/admin/menu/dishes` without a cookie returns `401 Unauthorized`. |
| **Turbopack Build** | `next build` | Build log shows "Using Turbopack" and completes successfully. |
