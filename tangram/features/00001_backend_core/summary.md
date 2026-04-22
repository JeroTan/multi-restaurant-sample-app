# Feature Summary: Backend Core API

## Intent
To establish the foundational data access layers and Edge API endpoints required for the SaaS platform. Before building any visual components, the backend must be robust and capable of securely handling multi-tenant data.

## Scope
- Centralized Drizzle ORM database connection.
- Edge API routes for Tenant onboarding, Table & QR generation, Menu Management, and Order Processing.
- Strict enforcement of `tenantId` isolation across all queries.
- Creation of a local testing suite/script to empirically verify each endpoint against a local Cloudflare D1 database.

## Strategic Fit
This feature directly supports **FR-01 through FR-07**. The backend serves as the single source of truth for the edge-native architecture, proving the feasibility of the D1 + OpenNext technical stack.
