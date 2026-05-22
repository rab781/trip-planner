## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2026-05-22 - Improved Chatbot Accessibility
**Learning:** Collapsible/floating chat widgets require clear programmatic association between the toggle button and the chat container for screen readers.
**Action:** Always use `useId()` to generate a unique ID for the container, and link it to the toggle button using `aria-controls`. Also, ensure `aria-expanded` accurately reflects the state and add visible focus styles for keyboard navigation.
