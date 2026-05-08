# Feature Roadmap: 00014_live_demo_ui_overhaul

## I. Architectural Alignment
- **UI Pillar**: Adhere to the "Apple Inspired" design system. Use the Neutral Triad palette, Inter typography, and established radius scale (56px for buttons, 18px for cards).
- **Stack Pillar**: Utilize Tailwind v4 design tokens and utility classes defined in `src/app/globals.css` (e.g., `.capsule-cta`, `.retail-card`).
- **Project Knowledge**: Follow the patterns established in `archive/2026-04-24-00003_ui_overhaul` for consistent component spacing and interactive states.

## II. Data Model & Schema Changes
- No schema changes. This is a pure UI/UX refactor of the existing `CreateDemoButton` component.

## III. Atomic Task List

### Layer: Component Overhaul
- [x] **Redesign Primary CTA Button**
  > **Detailed Summary:** Update the button in `src/components/CreateDemoButton.tsx` to use the `.capsule-cta` class. This sets the background to `Apple Action Blue` (#0071e3) and the shape to a 56px radius capsule. Add `active:scale-95` and `transition-all` for tactile feedback. Ensure the label uses `font-inter-tight` and `font-semibold`.

- [x] **Modernize Loading State**
  > **Detailed Summary:** Update the `Loader2` spinner to use `text-pure-white` and ensure it is centered within the capsule button. Maintain the button's dimensions while loading to prevent layout shifts.

- [x] **Redesign Success Dashboard Card**
  > **Detailed Summary:** Replace the legacy `bg-green-50` box with a sophisticated container styled for the "Showcase Black" section of the landing page. Use `bg-graphite-a` (#272729) with a `border-graphite-b` (#262629) and a `18px` (rounded-lg) radius.

- [x] **Refactor Demo Links into Retail Cards**
  > **Detailed Summary:** Style the 'Customer H5 Menu' and 'Admin Dashboard' links as nested components within the success state. Use the `.retail-card` style: `bg-pure-white`, `rounded-lg` (18px), with `text-near-black` titles and `text-apple-blue` icons. Add subtle hover shadows.

- [x] **Enhance Error Feedback**
  > **Detailed Summary:** Style error messages using `text-red-400` on the dark background. Ensure the font metrics align with the Inter tight system and that errors are presented in a clean, non-disruptive typographic block.

## IV. Critical Path & Dependencies
- The **Primary CTA Button** redesign is the first step as it's the main entry point.
- The **Success Dashboard Card** depends on the overall component structure being ready to receive the generated links.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **Capsule Styling** | Manual | Button appears as a 56px radius capsule with Apple Action Blue background. |
| **Tactile Feedback** | Manual | Button shrinks slightly (`scale-95`) when pressed. |
| **High Contrast Success** | Manual | Success card is clearly legible against the black background using Graphite tokens. |
| **Retail Card Links** | Manual | Demo links appear as white cards with 18px radius and correct typography. |
| **Responsive Loading** | Manual | Spinner appears without resizing the button container. |
