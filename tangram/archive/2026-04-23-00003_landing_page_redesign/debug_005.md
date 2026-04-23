## Surgical Repair: Implement Onboarding Flow on Landing Page

**Issue:** The user noted that the landing page only showed static non-functional links (`/demo/...`) and provided no way to actually create a tenant, tables, and test the app from start to finish. A working app needs an orchestration/onboarding flow directly accessible from the landing page.

- [x] task 1 - Create an interactive Demo Orchestrator Component
  > **Summary:** Create `src/components/CreateDemoButton.tsx`. This client component will call `/api/admin/tenants` to create a new unique tenant (e.g., `demo-restaurant-{Date.now()}`), call `/api/admin/tables` to generate tables with signatures, and optionally create a starter menu category/dish. It will then redirect the user to the newly created admin dashboard so they can experience the app end-to-end. Update `src/app/page.tsx` to use this button instead of the hardcoded non-functional static links.