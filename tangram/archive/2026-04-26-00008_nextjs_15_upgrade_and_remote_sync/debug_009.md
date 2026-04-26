# Sequential Debug Log: Build Lock (EBUSY) on Windows

**Issue Addressed**: The OpenNext build fails with `Error: EBUSY: resource busy or locked, rmdir 'F:\dev\website\multi-store-qr\.open-next\assets'`.

**Root Cause Analysis**: 
On Windows, if a terminal is currently running `wrangler dev`, it locks the assets directory defined in `wrangler.jsonc`. Since we just updated `wrangler.jsonc` to point to `.open-next/assets`, any subsequent `npm run build:worker` command will fail because it tries to delete that folder while Wrangler still has a handle on it.

## Fixing Checklist

- [x] task 2 - Dependency Bump (Next.js & OpenNext)
  > **Summary:** Implemented a "Clean Build" strategy to mitigate Windows file locking.
  > 1. Added a `"clean"` script to `package.json` that uses PowerShell's `Remove-Item` to forcefully wipe the `.next` and `.open-next` folders.
  > 2. Linked this to a `"prebuild:worker"` script so every build starts with a clean slate, reducing the chance of `EBUSY` locks.

