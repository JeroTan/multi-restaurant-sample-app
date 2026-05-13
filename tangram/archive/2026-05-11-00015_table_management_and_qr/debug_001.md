# Debug Session 001: Dashboard Logout

This session addresses the refinement request to add a logout functionality to the admin dashboard.

## Diagnostic Summary
- **Current State:** Admin authentication uses an HTTP-only cookie `admin_token` set during login.
- **Missing Piece:** No API endpoint to clear the cookie and no UI element to trigger the logout.
- **Constraint Check:** The logout button must fit into the "Apple-inspired" sidebar design defined in `tangram/design/ui.md`.

## Fixing Checklist

- [x] task 7.1 - Implement Logout API
  > **Summary:** Create `src/app/api/admin/auth/logout/route.ts`. The `POST` handler should clear the `admin_token` cookie by setting it with an expired `maxAge` or using `cookies().delete()`.
  
- [x] task 7.2 - Add Logout Button to Admin Sidebar
  > **Summary:** Modify `src/app/(admin)/[tenantSlug]/layout.tsx`. Add a "Log Out" button at the bottom of the sidebar. Use the `LogOut` icon from `lucide-react`. Ensure it triggers the `/api/admin/auth/logout` endpoint and redirects to the login page (`/auth/login`).
