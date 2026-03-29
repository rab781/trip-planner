## 2026-03-25 - Improved accessibility and focus states for ItineraryCard buttons
**Learning:** Hidden interactive elements (like the "Remove" button in `ItineraryCard`) that are only revealed on hover (`opacity-0 group-hover:opacity-100`) break keyboard navigation if they lack focus states. Screen readers also struggle with icon-only toggle buttons (like "Expand Tickets") without dynamic `aria-label` or `aria-expanded` attributes.
**Action:** When implementing "reveal-on-hover" buttons, always pair hover states with focus states (`focus:opacity-100 focus:outline-none focus:ring-2`) so keyboard users can discover and interact with them. Add `aria-hidden="true"` to purely decorative SVG icons within these buttons.

## 2025-06-01 - Focus States on Hover-Hidden Elements
**Learning:** In Tailwind, elements hidden via `opacity-0 group-hover:opacity-100` become inaccessible to keyboard users because they cannot hover over the group.
**Action:** Always pair `group-hover:opacity-100` with `group-focus:opacity-100` or add `focus:opacity-100 focus:ring-2` if the element itself is interactive (like a button), ensuring screen reader and keyboard accessibility.

## 2026-03-27 - Focus Within for Hidden Action Groups
**Learning:** Grouped action buttons hidden behind `opacity-0 group-hover:opacity-100` become completely inaccessible to keyboard users because they cannot hover, and when tabbed into, they remain invisible. Using `focus:opacity-100` on each button works, but adding `focus-within:opacity-100` to the container is better because it reveals the entire action group as soon as any child receives focus, providing better context. Also, drag handles (like `ArrowsUpDownIcon`) need explicit `aria-label`s since their purpose isn't inherently obvious to screen readers.
**Action:** When creating container `div`s with `opacity-0 group-hover:opacity-100` that contain interactive elements, always pair it with `focus-within:opacity-100` to ensure keyboard accessibility.
