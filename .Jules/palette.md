## 2026-03-25 - Improved accessibility and focus states for ItineraryCard buttons
**Learning:** Hidden interactive elements (like the "Remove" button in `ItineraryCard`) that are only revealed on hover (`opacity-0 group-hover:opacity-100`) break keyboard navigation if they lack focus states. Screen readers also struggle with icon-only toggle buttons (like "Expand Tickets") without dynamic `aria-label` or `aria-expanded` attributes.
**Action:** When implementing "reveal-on-hover" buttons, always pair hover states with focus states (`focus:opacity-100 focus:outline-none focus:ring-2`) so keyboard users can discover and interact with them. Add `aria-hidden="true"` to purely decorative SVG icons within these buttons.

## 2025-06-01 - Focus States on Hover-Hidden Elements
**Learning:** In Tailwind, elements hidden via `opacity-0 group-hover:opacity-100` become inaccessible to keyboard users because they cannot hover over the group.
**Action:** Always pair `group-hover:opacity-100` with `group-focus:opacity-100` or add `focus:opacity-100 focus:ring-2` if the element itself is interactive (like a button), ensuring screen reader and keyboard accessibility.
## 2024-05-23 - Focus Management on Hover-Revealed Containers
**Learning:** When action buttons inside a container are revealed only on hover (`opacity-0 group-hover:opacity-100`), they become inaccessible via keyboard navigation because focusing the inner button doesn't trigger the group hover, keeping the container visually hidden. Drag handles using icons like `ArrowsUpDownIcon` also require explicit `aria-label`s for screen readers since their visual representation isn't read aloud.
**Action:** Always pair `opacity-0 group-hover:opacity-100` with `focus-within:opacity-100` on the container so that keyboard navigation reveals the elements. Ensure icon-only drag handles have descriptive `aria-label`s and `aria-hidden="true"` on the SVG itself.
