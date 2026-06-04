## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-23 - Accessibility for Absolute Positioned Floating Action Buttons
**Learning:** Absolute positioned floating action buttons (FABs) that act as toggles (like the chatbot toggle) require explicit state and target mapping (`aria-expanded` and `aria-controls`) to be properly understood by screen readers, along with visible focus styles for keyboard navigation.
**Action:** Always include `aria-expanded`, `aria-controls`, and visible focus rings (e.g., `focus:outline-none focus:ring-2`) on absolute positioned FABs or icon-only controls in the design system.
## 2024-05-19 - Missing aria-controls in collapsible panels
**Learning:** In this application's components, we often see collapsible panels built with React state (like `DaySection` and `ItineraryCard`). While the toggle buttons have `aria-expanded` attributes, they frequently miss the corresponding `aria-controls` attribute linking them to the content container's ID.
**Action:** When auditing collapsible or conditionally rendered components, ensure `aria-controls` is present on the button and links to a dynamic `id` on the content container generated with `useId()`.
