## Surgical Repair: Missing Actionable Links on Landing Page

**Issue:** The user pointed out that the landing page shows the technical route structure (e.g., `/[tenantSlug]/orders`) as plain text but does not provide any clickable links to actually view the application's interface.

- [x] task 1 - Convert static cards into actionable Links
  > **Summary:** Modify `src/app/page.tsx` to import `Link` from `next/link`. Wrap the 3 feature cards in `<Link>` components pointing to a demo tenant route (`/demo/1`, `/demo/orders`, `/demo/menu`). Replace the technical route text at the bottom of each card with a clear "View Demo →" call to action. This makes the landing page functional and less "technical".