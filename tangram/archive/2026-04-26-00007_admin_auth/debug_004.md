# Sequential Debug Log: Modularize Middleware System

**Issue Addressed**: The `src/middleware.ts` file relies on procedural `if-else` blocks for routing and guard logic, making it less maintainable and scalable. The request is to refactor it using a chainable, modular builder pattern.

## Fixing Checklist

- [x] task 4 - Modularize Middleware System
  > **Summary:** Refactor the Next.js middleware by introducing a chainable builder.
  > 1. Create `src/lib/middleware/types.ts` to define the interfaces (`MiddlewareHandler`, `RouteConfig`).
  > 2. Create `src/lib/middleware/builder.ts` with a `MiddlewareBuilder` class implementing `.path(patterns)`, `.method(methods)`, and `.do(handler)` logic using `URLPattern`.
  > 3. Refactor `src/middleware.ts` to use `MiddlewareBuilder`, preserving all existing logic (public route skips, admin page/api guarding, JWT verification, and tenant isolation) without `if-else` routing chains.
