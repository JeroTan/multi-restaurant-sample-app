# Technical Roadmap: Brand Rename

## I. Architectural Alignment
- **Content Integrity:** Ensures that internal tooling/workflow names (Tangram) do not leak into the production UI.
- **User Prompt:** "can you remove any instance of text Tangram! tanggram is our workflow not a name or brand of this app lol. Just name it Multi QR Ordering System"

## II. Data Model & Schema Changes
- **No Database Schema changes.** This is purely a content update in the presentation layer.

## III. Atomic Task List

### UI Content Layer
- [x] **Task 1: Update Landing Page Branding**
  > **Detailed Summary:** Modify `src/app/page.tsx` to replace "Tangram QR Ordering" with "Multi QR Ordering System". Also, update the footer text from "Tangram Architecture" to a more appropriate generic tech stack description or remove the word Tangram.

- [x] **Task 2: Update Demo Orchestrator Mock Data**
  > **Detailed Summary:** Modify `src/components/CreateDemoButton.tsx` to change the mock data generation strings from "Tangram Demo Resto" to "Demo Restaurant" and "Tangram Burger" to "Classic Burger" (or similar).

## IV. Critical Path & Dependencies
1. Task 1 and Task 2 are independent and can be done simultaneously.

## V. Verification & Testing Mechanism

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Brand Removal** | Code Search / Manual Test | A search for the word "Tangram" in the `src/` directory returns 0 results. |
| **Landing Page** | Manual Browser Test | The landing page hero text displays "Multi QR Ordering System". |
| **Demo Data** | Manual Browser Test | Clicking "Generate Demo" creates a restaurant and dish without the word "Tangram" in their names. |