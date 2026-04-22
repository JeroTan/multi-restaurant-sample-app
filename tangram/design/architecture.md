# System Architecture

**Source of Truth:** User Prompt ("OpenNext + Cloudflare Worker and D1") + `tangram/overview.md`

## High-Level Flow
The application follows an Edge-First full-stack architecture powered by OpenNext.
1. **Client (Browser):** Customers scan QR codes; Staff access web dashboards.
2. **Edge Compute:** Next.js hosted on Cloudflare Workers via the OpenNext Deployment Adapters API, natively mapping Next.js primitives (SSR, ISR, Middleware) to Cloudflare.
3. **Database Layer:** Cloudflare D1 (Edge SQL) stores all multi-tenant data.

## Multi-Tenancy Strategy
- **Isolation:** Logical separation via a `restaurant_id` foreign key on all operational tables (Categories, Dishes, Orders, Tables).
- **Validation:** Middleware or data-access layers MUST enforce the `restaurant_id` filter on every query.

## Real-Time Strategy (Edge MVP)
- Due to the stateless nature of Cloudflare Workers and D1, the MVP will utilize **Optimized Polling** (e.g., SWR or React Query) for the staff order board. 
- *Note:* If true push notifications become strictly required, we will upgrade to Cloudflare Durable Objects + WebSockets in Phase 2.
