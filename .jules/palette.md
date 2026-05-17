## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-17 - Floating Chatbot Accessibility
**Learning:** React's `useId()` hook is highly effective for dynamically generating unique IDs in components to link `aria-controls` with `id` across rendering boundaries without collision risk. Floating action buttons that toggle panels must strictly pair `aria-expanded` and `aria-controls` for screen reader legibility.
**Action:** When creating or fixing toggleable overlay components (modals, slide-overs, chatbots), always ensure the trigger button explicitly communicates its state and target via ARIA, and use `useId()` to maintain robust ID references.
