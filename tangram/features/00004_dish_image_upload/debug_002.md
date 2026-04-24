# Debug Log: 002 - Defer Dish Image Upload to Creation Phase

## Overview
Currently, images are uploaded to R2 as soon as they are selected via the file input. The user wants to defer the upload until the "Create Dish" button is clicked to avoid "orphan" assets in R2 if the user cancels dish creation.

## Diagnostic Findings
1. **Immediate Trigger**: `handleFileUpload` was called `onChange` of the file input. (FIXED)
2. **State Management**: The state now uses `selectedFile` for the raw `File` object and `previewUrl` for local display. (FIXED)
3. **Draft State**: `URL.createObjectURL` is used for immediate visual feedback without network overhead. (FIXED)

---

- [x] task 3.1 - [Admin UI] Refactor Image State & Handler
    > **Summary:** Modified `MenuAdminClient.tsx`. Added `selectedFile` and `previewUrl` states. Implemented `handleFileSelection` to update local state and generate a blob preview URL. Added cleanup via `URL.revokeObjectURL` in `useEffect` and selection handler.

- [x] task 3.2 - [Admin UI] Synchronize Upload with Dish Creation
    > **Summary:** Refactored `createDish` in `MenuAdminClient.tsx`. The function now checks for `selectedFile`, performs the R2 upload if present, and then uses the resulting URL to create the dish record in the database. Added appropriate loading states and error handling during this sequential process.
