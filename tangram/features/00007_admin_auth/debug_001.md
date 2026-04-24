# Debug Log: 001 - TypeScript Error in Auth UI

## Overview
The Next.js build failed due to an invalid `size` prop being passed to the Next.js `Link` component in the login page. `next/link` does not support a `size` attribute.

## Diagnostic Findings
1. **Error**: `Property 'size' does not exist on type 'IntrinsicAttributes & ...'` (FIXED)
2. **Location**: `src/app/auth/login/page.tsx:69:52` (FIXED)
3. **Cause**: Accidentally included `size="sm"` on a `Link` component. (FIXED)

---

- [x] task 5.1 - [UI] Remove Invalid size Prop from Link
    > **Summary:** Refactored `src/app/auth/login/page.tsx`. Removed the `size="sm"` attribute from the "Forgot?" link. The styling is now handled correctly by standard className props.
