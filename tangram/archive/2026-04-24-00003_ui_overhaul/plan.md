# Technical Roadmap: Apple-Inspired UI Overhaul

## I. Architectural Alignment
- **UI Pillar:** Implements the binary rhythm, neutral triad palette, and tiered radius scales defined in `ui.md`.
- **Stack Pillar:** Transition to CSS-first Tailwind v4 configuration and `next/font/google` for self-hosted typography.
- **Structure Pillar:** Utilizes the "Two Gears" strategy for component density (Showcase vs Transactional).

## II. Data Model & Schema Changes
- No schema changes required. This is a purely visual/structural refactor.

## III. Atomic Task List

### Foundation & Global Styles
- [x] **Task 1: Self-Hosted Font Integration**
    > **Detailed Summary:** Modify `src/app/layout.tsx` to import `Inter` and `Inter Tight` from `next/font/google`. Configure them to export CSS variables (`--font-inter`, `--font-inter-tight`) and apply them to the root `<html>` element. This ensures fonts are downloaded at build time and served locally.

- [x] **Task 2: Tailwind v4 CSS-First Overhaul**
    > **Detailed Summary:** Rewrite `src/app/globals.css`. Replace placeholder tokens with the full Apple-inspired `@theme` block. Include variables for `Absolute Black`, `Pale Apple Gray`, `Pure White`, `Apple Action Blue`, and the `Graphite` series. Map the radii tiers (5px, 12px, 18px, 56px) to Tailwind's `rounded-*` system.

### Page-Level Refactoring
- [x] **Task 3: Landing Page "Binary Rhythm"**
    > **Detailed Summary:** Refactor `src/app/page.tsx` (Showcase Mode). Implement high-contrast black (`#000000`) and pale gray (`#f5f5f7`) sections. Use `Inter Tight` for XL hero displays and "Capsule" geometry for primary CTAs.

- [x] **Task 4: Admin Dashboard Refactor (Transactional Mode)**
    > **Detailed Summary:** Update the admin layout and `OrdersClient.tsx`. Transition from generic shadows to Level 1-3 elevation. Use `Graphite` surfaces for overlays and ensure high information density using the precision typographic hierarchy.

### Component-Level Refactoring
- [x] **Task 5: Customer H5 Ordering Overhaul**
    > **Detailed Summary:** Refactor `src/components/CustomerMenuClient.tsx`. Implement object-first imagery, white transactional fields, and the `Apple Action Blue` primary interactive signals. Ensure all touch targets meet the 44px minimum.

- [x] **Task 6: Admin Management Components**
    > **Detailed Summary:** Refactor `MenuAdminClient.tsx` and `TablesAdminClient.tsx`. Update all buttons to use the Apple radius scale (8px-12px) and the specific button fill roles defined in the spec.

## IV. Critical Path & Dependencies
1. **Tasks 1 & 2** are strict blockers for all component refactoring.
2. **Task 3** serves as the reference for "Showcase Mode."
3. **Task 4** serves as the reference for "Transactional Mode."

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Typography** | Browser Inspector | Root fonts mapped to `Inter` and `Inter Tight` variables. |
| **Palette** | Visual Inspection | Landing page uses `#000000` and `#f5f5f7` chaptering. |
| **Radius Scale** | CSS Audit | Buttons use 8px-12px; Cards use 18px radius. |
| **Edge Compatibility**| Build Command | `npm run build` succeeds (verifying `next/font` self-hosting). |
| **Mobile UX** | DevTools Emulation| Customer menu touch targets >= 44px; single-column collapse at 375px. |
