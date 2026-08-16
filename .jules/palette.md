## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-23 - Accessibility for Absolute Positioned Floating Action Buttons
**Learning:** Absolute positioned floating action buttons (FABs) that act as toggles (like the chatbot toggle) require explicit state and target mapping (`aria-expanded` and `aria-controls`) to be properly understood by screen readers, along with visible focus styles for keyboard navigation.
**Action:** Always include `aria-expanded`, `aria-controls`, and visible focus rings (e.g., `focus:outline-none focus:ring-2`) on absolute positioned FABs or icon-only controls in the design system.

## 2026-06-14 - Dynamic Filter Panel Accessibility
**Learning:** Discovered that dynamic toggle panels (like the filter sidebar on the Map page) were missing critical ARIA attributes to communicate their state and target area to screen readers.
**Action:** Always add `aria-expanded={isOpen}` and `aria-controls="[panel-id]"` to the toggle button, and `id="[panel-id]"` to the dynamically rendered panel container.

## 2024-05-24 - WAI-ARIA Disclosure Pattern for List Components
**Learning:** In list-rendered or looping React components (like `DaySection` or itinerary cards), manual ID assignments can cause DOM collisions, breaking screen reader associations for `aria-controls`.
**Action:** Always use the `useId()` hook to generate unique IDs dynamically when implementing the WAI-ARIA disclosure pattern inside loops or reusable components.
## 2026-08-16 - Modal Close Button Accessibility
**Learning:** Icon-only close buttons in modals (like `XMarkIcon` in `DestinationReplacementModal`) often lack `aria-label` attributes and distinct keyboard focus rings (`focus:ring-2`), hindering screen reader usage and keyboard navigation.
**Action:** When creating or reviewing modal components, proactively verify and add `aria-label` to icon-only buttons, apply visible focus states (`focus:ring-2`, `focus:ring-offset-2`), and ensure decorative icons have `aria-hidden="true"`.
