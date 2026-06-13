## 2026-05-01 - [Budget Summary Accessibility]
**Learning:** Adding accessibility to collapsible summary sections in React components requires standard WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls` on the button, and matching `id` on the content). It also requires using the `useId()` hook to generate unique DOM IDs and prevent collisions across multiple instances of the component.
**Action:** Apply this WAI-ARIA disclosure pattern with `useId()` consistently whenever implementing accordion-style or collapsible UI elements to ensure they are accessible.
## 2024-05-23 - Accessibility for Absolute Positioned Floating Action Buttons
**Learning:** Absolute positioned floating action buttons (FABs) that act as toggles (like the chatbot toggle) require explicit state and target mapping (`aria-expanded` and `aria-controls`) to be properly understood by screen readers, along with visible focus styles for keyboard navigation.
**Action:** Always include `aria-expanded`, `aria-controls`, and visible focus rings (e.g., `focus:outline-none focus:ring-2`) on absolute positioned FABs or icon-only controls in the design system.
## 2026-06-13 - Add aria-label to Back button in Itinerary Create
**Learning:** The application uses Indonesian predominantly. We should keep ARIA labels localized to the user language. The back button used `window.history.back()` and had only an icon.
**Action:** Always verify if an icon-only button needs an `aria-label`, and use the contextually appropriate Indonesian term (e.g., 'Kembali' for 'Back').
