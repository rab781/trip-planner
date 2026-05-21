## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.

## 2024-05-08 - Floating Action Button Panel Accessibility
**Learning:** For components featuring absolute positioned floating action buttons (FABs) that act as toggles for hidden panels (like a chat window), screen readers require an explicit structural connection. Simply toggling visual visibility isn't enough; the button needs `aria-expanded` and `aria-controls` pointing to the panel's unique ID to establish the relationship. Additionally, custom controls within absolute positioned containers often miss focus rings by default and must explicitly define them (`focus:ring`) for keyboard users.
**Action:** Always link toggle FABs to their respective target panels using generated IDs and ARIA attributes. Proactively check and implement focus rings on floating interactive elements.
