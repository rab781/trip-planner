## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-20 - Add Accessibility Attributes to Chatbot Toggle
**Learning:** Using `useId()` from React is essential when adding `aria-controls` to dynamically rendered components like FABs, ensuring the ID linking the button to its controlled container (e.g. chat window) remains globally unique even if the component is mounted multiple times or structurally altered.
**Action:** Next time I implement a toggleable floating panel or modal, I will immediately include `useId()` for the `id` and `aria-controls` pair rather than relying on hardcoded string IDs.
