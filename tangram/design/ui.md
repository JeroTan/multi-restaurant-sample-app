# UI/UX Pro Max Blueprint

**Source of Truth:** `.gemini/knowledge/ui/design-protocol.md`

## Design System Tokens
- **Base Scale:** 8px base spacing scale (`space-sm: 8px`, `space-md: 16px`). No magic numbers.
- **Radius:** "Soft" aesthetics with `12px` default (`rounded-xl` in Tailwind).
- **Accessibility:** All text-to-background contrast MUST pass WCAG 2.1 AA.

## State Logic & Depth
- **States:** All atoms must support Ideal, Empty, Error, Loading (Skeletons), and Focus (e.g., `focus:ring-2`).
- **Elevation Map:**
  - `Surface 0`: App Background.
  - `Surface 1`: Cards/Menu Items (+1 shadow).
  - `Surface 2`: Modals/Cart Popovers (+2 deep shadow + optional blur).

## Adaptive Breakpoints
- **Mobile (375px):** Primary focus for the Customer H5 ordering interface (Touch targets ≥ 44x44px).
- **Desktop (1440px):** Primary focus for the Staff and Admin Dashboards.
