# Technical Roadmap: Downloadable QR Codes

## I. Architectural Alignment
- **Stack Pillar:** Next.js App Router (React Client Components).
- **Compute Pillar:** Client-side image generation and download. Offloading this to the browser prevents unnecessary load on the Cloudflare Edge Worker.
- **UI Design Pillar:** 8px base scale. Use `lucide-react` icons (e.g., `Download`) for clear UI affordances. Keep the download button hidden when printing using `print:hidden`.

## II. Data Model & Schema Changes
- **No Database Schema changes.** This is a purely frontend, client-side interaction update.

## III. Atomic Task List

### UI Presentation Layer
- [x] **Task 1: Implement QR Code Download Logic**
  > **Detailed Summary:** Modify `src/components/TablesAdminClient.tsx`. 
  > - Add a new function `downloadQR(tableNumber: string, qrUrl: string)` or similar that programmatically creates an HTML5 `<canvas>`, draws the SVG content of the `QRCode` onto it (by serializing the SVG to a data URL), and triggers a download of the resulting PNG file (e.g., named `Table-[tableNumber]-QR.png`).
  > - Add an `id` or `ref` to the `QRCode` wrapper if necessary for DOM extraction, though parsing the SVG directly or using an established library technique is preferred.
  > - Add a Download button (using `Download` icon from `lucide-react`) below each QR code in the grid.
  > - Ensure this button has the `print:hidden` class so it doesn't appear on physical printouts.

## IV. Critical Path & Dependencies
1. Task 1 is self-contained within `src/components/TablesAdminClient.tsx` and has no external dependencies.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **FR-06** (Download) | Manual Browser Test | Clicking the download button on a QR code card successfully downloads a PNG file of the QR code. |
| **Print Layout** | Manual Browser Test | The newly added download button is NOT visible when triggering the browser's Print dialog. |