# Debug Session 004: Restoring Build Stability and WebSocket Verification

This session addresses the build regression and the user's concern regarding WebSocket functionality.

## Diagnostic Summary
- **Build Failure:** The TypeScript compiler fails because `res.json()` returns `unknown`, and the code accesses `data.error` without a type cast.
- **WebSocket Concern:** The user expressed concern about "deleting websocket". This likely refers to the removal of the `OrderSync` property from the `default` export in the previous turn. 
- **Durable Object Warning:** The `workerd` runtime is warning that it cannot find the `OrderSync` export. This needs to be resolved by ensuring the named export is correctly recognized.
- **Clarification:** WebSocket functionality (the `/ws` route interceptor) is still present in `src/worker.ts`. The `OrderSync` class is still defined and exported.

## Fixing Checklist

- [ ] task 4.3 - Fix TypeScript Build Error (Regression)
  > **Summary:** Correct the `unknown` type issue in `src/components/TablesAdminClient.tsx` by casting the API response to `any`. This is a surgical fix to restore buildability.

- [ ] task 1.3 - Restore and Verify Durable Object Export
  > **Summary:** In `src/worker.ts`, ensure `OrderSync` is exported in a way that is compatible with both ESM named exports and the `workerd` runtime expectations. I will restore it to the `default` object if necessary, but primarily ensure the named export `export { OrderSync }` is correctly handled. I will also fix the duplicate `// 2.` comments in the file.
