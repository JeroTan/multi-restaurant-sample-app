# Debug Log: 006 - Re-implementation of Apple Precision UI (UI-ONLY)

## Overview
Re-implementing the 🍎 Apple Precision UI overhaul after user revert. 
**CRITICAL MANDATE:** 
1. UI-ONLY changes. 
2. DO NOT modify `src/app/api`, `src/db`, or any backend logic. 
3. Maintain 100% functionality of WebSockets and Drag-and-Drop.
4. Adapt the UI to the EXISTING API responses (do not ask for more data from the backend).

## Diagnostic Findings
1. **Globals & Fonts**: The system has reverted to generic Tailwind v4 defaults and standard Inter font. (FIXED)
2. **Landing Page**: Currently a generic gradient hero; needs the "Binary Rhythm" (Black/Pale Gray) overhaul. (FIXED)
3. **Customer Menu**: Functional but "soft" aesthetic; needs precision typography and 44px touch targets. (FIXED)
4. **Admin Dashboard**: Drag-and-drop works but looks like a generic bootstrap-style dashboard. Needs level-based elevation and graphite tones. (FIXED)

---

- [x] task 1 - [Foundation] Apple-Inspired globals.css & Layout
    > **Summary:** Refactor `src/app/globals.css` with the Neutral Triad palette (`#000000`, `#f5f5f7`, `#ffffff`) and the 4-tier radius scale. Configure `src/app/layout.tsx` with `Inter` and `Inter Tight` using `next/font/google` CSS variables.

- [x] task 3 - [Landing] Binary Rhythm Overhaul
    > **Summary:** Refactor `src/app/page.tsx` to use the cinematic high-contrast sectioning. Implement the "Showcase Mode" with `Inter Tight` headings and capsule CTAs.

- [x] task 4 - [Admin] Transactional Kanban Refactor
    > **Summary:** Refactor `src/components/OrdersClient.tsx`. Apply Level 1-3 elevation to columns and cards. Maintain all `@dnd-kit` logic. Use the `Graphite` color scale for UI elements. **DO NOT** modify the API fetch logic or the data structure.

- [x] task 5 - [Customer] Immersive Mobile-First Menu
    > **Summary:** Refactor `src/components/CustomerMenuClient.tsx`. Implement editorial category headers, white transactional cards, and 44px pill buttons. Maintain WebSocket sync and existing order tracking logic.

- [x] task 6 - [Admin Management] Precision Components
    > **Summary:** Refactor `MenuAdminClient.tsx` and `TablesAdminClient.tsx`. Update buttons and tables to the precision radius (8px-12px) and use the `Apple Action Blue` interactive signals.
