# Technical Roadmap: Durable Object Free Plan Fix

## I. Architectural Alignment
- **Stack Pillar:** Cloudflare Durable Objects.
- **Billing Constraint:** Cloudflare Free Tier.
- **Reference:** https://developers.cloudflare.com/durable-objects/get-started/#durable-objects-with-sqlite-storage
- **User Prompt:** "sorry I'm in free plan we need to create sql_lite something... create a namespace using a `new_sqlite_classes` migration."

## II. Data Model & Schema Changes
- **Migration Update:** The `ORDER_SYNC` namespace will be redefined as a SQLite-backed Durable Object.

## III. Atomic Task List

### Configuration Layer
- [x] **Task 1: Update wrangler.jsonc for SQLite Durable Objects**
  > **Detailed Summary:** Modify the `migrations` section in `wrangler.jsonc`. Replace the `new_classes` key with `new_sqlite_classes` for the `v1` tag (or increment the tag if preferred, though replacing is cleaner for a fresh fix). This tells Cloudflare to create the Durable Object namespace using the new SQLite-backed engine available on the free tier.

- [x] **Task 2: Verify Durable Object Class Code**
  > **Detailed Summary:** Check `src/db/order-sync-do.ts`. Ensure that the implementation is compatible with SQLite storage (though for simple WebSocket broadcasting, no direct storage changes are strictly required, it's good to ensure no legacy storage APIs are being used that might conflict).

## IV. Critical Path & Dependencies
1. Task 1 is the direct fix for the error.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Namespace Creation** | Wrangler Build/Deploy | Running `npm run build:worker` or `wrangler deploy` no longer returns the code 10097 error. |
| **Local Proxy** | `wrangler dev` | The local development environment successfully initializes the `ORDER_SYNC` object. |
