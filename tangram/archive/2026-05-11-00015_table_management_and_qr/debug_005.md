# Debug Session 005: Table Card UI Refinement and Responsiveness

This session addresses UI regressions in the table management dashboard, specifically focusing on overlapping elements and visibility of action buttons.

## Diagnostic Summary
- **Overlapping Content:** The selection checkbox and edit/delete actions are using `absolute` positioning at the top corners of the card. When the card shrinks on smaller screens or the content is centered, these elements overlap the tenant name and table title.
- **Button Visibility:** The delete icon color was reported as "white" (or difficult to see). It currently uses `text-near-black/40`, which might be too faint on certain backgrounds or affected by unexpected styles.
- **Layout Responsiveness:** The current absolute positioning doesn't scale well. A more robust flex/grid structure inside the card is needed.

## Fixing Checklist

- [x] task 4.4 - Refactor Table Card Layout
  > **Summary:** Modify `src/components/TablesAdminClient.tsx`. Remove `absolute` positioning for the checkbox and action group. Introduce a top-row flex container inside each card to house the checkbox (left) and the action buttons (right) cleanly. This ensures they never overlap the content below.

- [x] task 4.5 - Fix Button Styling and Contrast
  > **Summary:** Update the individual delete button to use `text-apple-red` by default or a high-contrast `text-near-black/60`. Ensure the edit button uses `text-apple-blue`. Remove the `opacity-0 group-hover:opacity-100` restriction to ensure touch-screen users can see them without a "hover" state.

- [x] task 4.6 - Enhance Responsiveness
  > **Summary:** Ensure the QR code and link container scale correctly. Use `w-full` and proper padding to prevent overflow on mobile. Verify the grid layout `sm:grid-cols-2` is appropriate for the content width.
