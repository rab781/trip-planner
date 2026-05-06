## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-18 - Add aria-expanded to floating panel toggle buttons
**Learning:** Floating action buttons that open panels (like chat windows or map settings) often lack `aria-expanded` and `aria-controls` bindings. While visually obvious, screen readers won't know if the panel is currently open or which element the button toggles.
**Action:** Always verify floating toggle buttons include `aria-expanded={isOpen}` and `aria-controls="panel-id"` connecting to the target container.
