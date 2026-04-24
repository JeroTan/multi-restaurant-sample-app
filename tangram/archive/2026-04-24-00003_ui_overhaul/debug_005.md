# Debug Log: 005 - Total UI Re-implementation (Regression-Free)

## Overview
Re-implementing the 🍎 Apple Precision UI overhaul after a complete revert. The goal is to apply the new visual standards while strictly maintaining the functional mechanics of the WebSocket sync, customer tracking, and admin data integrity. 

## Diagnostic Findings (Pre-Refactor)
1. **WS Logic**: Current system uses `window.location.host`. This fails in dev (3000) because the worker is on 8787.
2. **Missing Details**: The admin Kanban currently only shows order headers; items (logs) are missing.
3. **Immersion**: `window.alert` is still the primary error mechanism.

---

- [ ] task 1 - [Foundation] Apple-Inspired global.css & Layout
    > **Summary:** Refactor `globals.css` using Tailwind v4 CSS-first patterns. Implement the Neutral Triad palette. Use `next/font/google` for self-hosted Inter/Inter Tight in `layout.tsx`.

- [ ] task 4 - [Admin] Immersive Kanban & Robust API Sync
    > **Summary:** Update `src/app/api/admin/orders/route.ts` to include `orderItems`. Refactor `OrdersClient.tsx` to the Apple aesthetic, ensuring the `wsUrl` correctly handles Port 8787 in development and displays itemized "logs."

- [ ] task 5 - [Customer] Immersive Menu & Live Tracking
    > **Summary:** Refactor `CustomerMenuClient.tsx`. Maintain the WebSocket listener and inline "Your Orders" section. Replace all `alert()` calls with a state-based status toast. Ensure all touch targets are 44px.
