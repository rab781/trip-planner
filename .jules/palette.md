## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.

## 2024-05-21 - Icon-only Action Button Accessibility
**Learning:** Admin tables frequently use icon-only buttons for actions (like Edit, Delete, View) without descriptive text. These buttons often rely only on a `title` attribute for screen readers, which is insufficient, and they lack `aria-label` attributes or `aria-hidden` on the inner SVG elements, resulting in poor accessibility and potentially confusing readouts. In addition, keyboard focus outlines were missing.
**Action:** Always verify that icon-only buttons include explicit `aria-label` attributes detailing their purpose (e.g., "Edit destination [Name]"), use `aria-hidden="true"` on the enclosed `svg` icons, and include focus styling (e.g., `focus:ring-2`) to ensure reliable keyboard navigation.
