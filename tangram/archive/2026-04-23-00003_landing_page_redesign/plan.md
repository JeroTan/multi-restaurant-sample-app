# Technical Roadmap: Landing Page Redesign

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (React Server Components) with Tailwind CSS and `lucide-react` icons.
- **UI Design Pillar:** Strict adherence to `.gemini/knowledge/ui/design-protocol.md` and `tangram/design/ui.md`. 
  - Base Scale: 8px.
  - Radius: 12px (`rounded-xl`).
  - Elevations: Soft shadows for depth.
- **User Prompt:** "The ui is very ugly in the landing page lol"

## II. Data Model & Schema Changes
- **No Database Schema changes.** This is a purely cosmetic and static structural update to the root route.

## III. Atomic Task List

### UI Presentation Layer
- [x] **Task 1: Redesign `src/app/page.tsx`**
  > **Detailed Summary:** Rewrite `src/app/page.tsx` to implement a modern, visually striking landing page. 
  > - Use a gradient or patterned background (Surface 0).
  > - Create a centralized hero section with a compelling headline and description.
  > - Implement a grid of cards (Surface 1 with `rounded-xl` and shadow) that visually explain the three main routing concepts: Admin Dashboard (`/[tenantSlug]/orders`), Menu Management (`/[tenantSlug]/menu`), and Customer H5 (`/[tenantSlug]/[tableNumber]`).
  > - Integrate `lucide-react` icons (e.g., `Store`, `QrCode`, `ChefHat`, `LayoutDashboard`) to provide immediate visual context to the text.
  > - Ensure WCAG 2.1 AA text contrast compliance.

## IV. Critical Path & Dependencies
1. Task 1 is independent and only requires the existing Tailwind setup.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Aesthetics Alignment** | Visual Inspection | Page utilizes `rounded-xl`, soft shadows, and clean typography. It must no longer look "very ugly". |
| **Content Accuracy** | Manual Browser Test | The page clearly communicates the dynamic routes (`[tenantSlug]`) needed to use the app. |
| **Responsive Design** | Manual Browser Test | The layout adapts gracefully from mobile (375px) to desktop (1440px) viewports without breaking. |