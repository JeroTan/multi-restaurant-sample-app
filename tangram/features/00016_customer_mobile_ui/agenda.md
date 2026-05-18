# Agenda: Feature 00016 - Customer Mobile Responsive UI

## I. Problem Statement
The customer-facing UI is not properly responding to mobile screen sizes. On mobile devices, the interface appears "zoomed out," effectively rendering the desktop version at a smaller scale rather than adapting to the mobile viewport.

## II. Objectives
- Fix the mobile viewport configuration to ensure 1:1 scaling.
- Ensure the customer layout fits the mobile screen width without horizontal overflow or artificial zooming.
- Apply mobile-first styling to key customer components.

## III. Scope of Work
- **Global Configuration**: Audit and update `src/app/layout.tsx` to include proper viewport metadata.
- **Layout Refinement**: Modify `src/app/(customer)/layout.tsx` to ensure the `main` container is responsive (`w-full` on mobile, `max-w-md` on desktop).
- **Component Audit**: Review `CustomerMenuClient.tsx` for any fixed-width elements or responsive utility conflicts that might trigger overflow.
- **Visual Validation**: Verify the UI across standard mobile breakpoints (375px, 390px, 414px).

## IV. Technical Approach
1. **Viewport Meta**: Add `viewport` metadata export to the Root Layout.
2. **Container Fluidity**: Update `CustomerLayout` to use `w-full` with `max-w-md mx-auto` to ensure it fills small screens but stays centered on large ones.
3. **Overflow Check**: Inspect `CustomerMenuClient` for elements that might exceed the `max-w-md` width or have rigid `sm:` breakpoints that break mobile layouts.

## V. Validation Checklist
- [ ] UI scales 1:1 on mobile devices (no initial zoom-out).
- [ ] No horizontal scrolling on mobile.
- [ ] Content fills the width of the screen on devices < 448px (md).
- [ ] Navigation and floating cart remain functional and accessible on small screens.
