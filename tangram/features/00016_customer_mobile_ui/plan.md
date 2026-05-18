# Technical Roadmap: 00016 - Customer Mobile Responsive UI

## I. Architectural Alignment
This feature aligns with the mobile-first principles outlined in `tangram/design/ui.md`. By utilizing Next.js viewport configurations and Tailwind CSS fluid constraints, we maintain the Apple-like aesthetic without compromising accessibility on varied device sizes.

## II. Data Model & Schema Changes
*No database or schema changes required.*

## III. Atomic Task List

### UI & Layout Updates

- [x] **Task 1: Add Viewport Metadata to Root Layout**
  > **Detailed Summary:** In Next.js (app router), viewport configurations are separated from general metadata. Update `src/app/layout.tsx` to export a `viewport` object with `width: 'device-width'`, `initialScale: 1`, and `maximumScale: 1`. This explicitly tells mobile browsers not to scale the page down to fit a desktop layout.

- [x] **Task 2: Refactor Customer Layout Fluidity**
  > **Detailed Summary:** Modify `src/app/(customer)/layout.tsx`. Ensure the `<main>` tag includes `w-full` alongside `max-w-md` and `mx-auto`. This guarantees the container expands to 100% of the screen on devices narrower than the `md` breakpoint, eliminating empty gutters on small phones.

- [x] **Task 3: Audit and Fix Overflow in Customer Menu Client**
  > **Detailed Summary:** Update `src/components/CustomerMenuClient.tsx`. Add `w-full` to necessary flex containers. Ensure long text blocks (like dish names or descriptions) use `break-words` or `line-clamp` correctly, and verify that the fixed bottom action bar (`Floating Action Button`) is constrained properly to prevent it from exceeding screen bounds.

## IV. Critical Path & Dependencies
- **Dependencies:** None.
- **Sequence:** Execute Task 1 first (global fix), followed by Tasks 2 and 3 (layout specifics).

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Viewport Scale** | Manual (Mobile Emulator) | The app loads at 100% scale on mobile; no zooming out occurs. |
| **Fluid Container** | Manual (Resize Browser) | The layout fills the width on mobile but caps at ~448px (max-w-md) on desktop. |
| **No Horizontal Scroll** | Manual (Mobile Emulator) | Users cannot scroll left or right; all content fits within the screen edges. |
