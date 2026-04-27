# Technical Roadmap: Restaurant Jargon UI Update

## I. Architectural Alignment
- **UI Pillar**: Adheres to the user personas ("Guest" and "Staff") by using language that is natural and intuitive to their daily operations, moving away from internal developer terminology.
- **Historical Consistency**: Follows the pattern of the recent Brand Rename (archive/00008), focusing purely on presentation layer adjustments without altering underlying logic.

## II. Data Model & Schema Changes
- No database schema changes required.

## III. Atomic Task List

### UI Layer (Copywriting)
- [x] **Task 1: Landing Page Copy Update**
    > **Detailed Summary:** Modify `src/app/page.tsx`. Replace technical jargon with restaurant-friendly terms. 
    > - "The edge-native platform" -> "The lightning-fast platform"
    > - "Customer Interface" -> "Digital Menu"
    > - "Live Order Board" -> "Kitchen Display"
    > - "Real-time Kanban synchronization powered by Durable Objects. Zero-latency coordination." -> "Real-time order synchronization. Seamless kitchen coordination."
    > - "Menu Engineering" -> "Menu Management"
    > - "A surgical dashboard" -> "An intuitive dashboard"
- [x] **Task 2: Admin Dashboard Copy Update**
    > **Detailed Summary:** Modify `src/components/MenuAdminClient.tsx`. Find the `<h1>` heading currently reading "Menu Engineering" and change it to "Menu Management".

## IV. Critical Path & Dependencies
- This is a non-blocking, presentation-only feature.
- Tasks can be executed concurrently or sequentially.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Landing Page Jargon Removal** | Code Search / Manual Test | A search for "Kanban", "edge-native", or "Menu Engineering" in `src/app/page.tsx` returns 0 results. |
| **Admin UI Consistency** | Manual Visual Check | Navigating to the Admin Menu displays "Menu Management" as the page title. |
