# Technical Roadmap: Remote Database Migration

## I. Architectural Alignment
- **Stack Pillar:** Cloudflare D1 (SQLite at the Edge).
- **Deployment Pillar:** CI/CD & operational scripts for database management via Wrangler.
- **User Prompt:** "Please don't forgot to migrate the db now that it is should be on remote"

## II. Data Model & Schema Changes
- **No new Schema changes.** This feature focuses on the operational task of applying the existing local migrations to the remote D1 instance (`multi-restaurant-db`).

## III. Atomic Task List

### Database Operational Layer
- [x] **Task 1: Add Remote Migration Script**
  > **Detailed Summary:** Modify `package.json` to include a new script `"db:migrate:remote": "wrangler d1 migrations apply multi-restaurant-db --remote"`. This provides a standardized way to execute remote migrations without having to remember the exact Wrangler command syntax.

- [x] **Task 2: Execute Remote D1 Migration**
  > **Detailed Summary:** Run the newly created `npm run db:migrate:remote` script. This will connect to the Cloudflare account via Wrangler, target the `multi-restaurant-db` D1 database using the `database_id` bound in `wrangler.jsonc`, and apply the unapplied schema files located in `src/db/migrations/` to the live remote database.

## IV. Critical Path & Dependencies
1. Task 1 (Script creation) must occur before Task 2 (Execution).
2. The user must be authenticated with Cloudflare via `wrangler login` (or have `CLOUDFLARE_API_TOKEN` set) for Task 2 to succeed.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Operational Script** | Manual Review | `package.json` contains the correct `"db:migrate:remote"` command. |
| **Remote Schema Sync** | Wrangler Command | Executing `npx wrangler d1 info multi-restaurant-db` or similar reflects the applied migrations on the remote server, and no errors occur during `npm run db:migrate:remote`. |