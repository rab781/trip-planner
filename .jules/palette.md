## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.

## 2026-05-02 - [FAB Accessibility Pattern]
**Learning:** Floating Action Buttons (FABs) that act as toggles for WAI-ARIA disclosure widgets (like a chat window) require the `aria-expanded` attribute, an `aria-controls` attribute linking to the controlled container's ID, and an appropriate `aria-label` or visible text. In React applications, using the `useId()` hook is the most robust way to generate the required ID for the controlled element to ensure cross-component compatibility. They also require explicit keyboard focus styles for accessibility.
**Action:** Always implement this pattern when building any FAB or icon-only button that toggles the visibility of another element.
