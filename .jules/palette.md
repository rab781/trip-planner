## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-18 - Floating Action Button Accessibility
**Learning:** Adding `aria-controls` to a Floating Action Button (FAB) that toggles a panel requires a unique, generated ID to prevent potential DOM collisions, especially if the component might be instantiated multiple times.
**Action:** Use React's `useId()` hook to generate unique IDs and pair it with `aria-controls` and `aria-expanded` to provide clear structure for screen readers, while also ensuring visible focus states for keyboard navigation.
