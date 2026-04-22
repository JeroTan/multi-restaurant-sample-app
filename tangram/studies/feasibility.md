# Feasibility Study

## Project Status
This is a **Proof of Concept (PoC) / Sample App** designed to validate the core SaaS multi-tenant workflow.

## Scope & Budget
- **Infrastructure:** Highly optimized for the Cloudflare ecosystem.
- **Compute:** Cloudflare Workers (Edge-side execution).
- **Database:** Cloudflare D1 (Edge SQL Database).
- **Cost Target:** Zero-to-low overhead for initial validation.

## Technical Risks
- **Real-time Sync:** Ensuring <5s order notification latency using edge-compatible push (WebSockets/SSE) or optimized polling.
- **D1 Constraints:** Managing relational data within the specific limits and features of D1.
- **Edge Performance:** Maintaining <2s FCP on global edge nodes.
