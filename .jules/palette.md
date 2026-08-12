## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-23 - Accessibility for Absolute Positioned Floating Action Buttons
**Learning:** Absolute positioned floating action buttons (FABs) that act as toggles (like the chatbot toggle) require explicit state and target mapping (`aria-expanded` and `aria-controls`) to be properly understood by screen readers, along with visible focus styles for keyboard navigation.
**Action:** Always include `aria-expanded`, `aria-controls`, and visible focus rings (e.g., `focus:outline-none focus:ring-2`) on absolute positioned FABs or icon-only controls in the design system.

## 2026-06-14 - Dynamic Filter Panel Accessibility
**Learning:** Discovered that dynamic toggle panels (like the filter sidebar on the Map page) were missing critical ARIA attributes to communicate their state and target area to screen readers.
**Action:** Always add `aria-expanded={isOpen}` and `aria-controls="[panel-id]"` to the toggle button, and `id="[panel-id]"` to the dynamically rendered panel container.
## 2024-06-24 - Missing aria-controls on Expandable Sections
**Learning:** Collapsible sections like "Tiket Tambahan" in `ItineraryCard.jsx` often lack `aria-controls` bindings to their target containers, despite having `aria-expanded` and semantic roles. This is a common pattern when components are built rapidly without explicit accessibility reviews. Using React's `useId()` hook provides a robust, collision-free way to link these elements.
**Action:** When creating or reviewing components with expandable/collapsible content (accordions, dropdowns, optional detail sections), ensure that both `aria-expanded` on the trigger and `aria-controls` pointing to the conditionally rendered container's ID are present.
