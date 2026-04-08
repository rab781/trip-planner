## 2026-03-25 - Improved accessibility and focus states for ItineraryCard buttons
**Learning:** Hidden interactive elements (like the "Remove" button in `ItineraryCard`) that are only revealed on hover (`opacity-0 group-hover:opacity-100`) break keyboard navigation if they lack focus states. Screen readers also struggle with icon-only toggle buttons (like "Expand Tickets") without dynamic `aria-label` or `aria-expanded` attributes.
**Action:** When implementing "reveal-on-hover" buttons, always pair hover states with focus states (`focus:opacity-100 focus:outline-none focus:ring-2`) so keyboard users can discover and interact with them. Add `aria-hidden="true"` to purely decorative SVG icons within these buttons.

## 2025-06-01 - Focus States on Hover-Hidden Elements
**Learning:** In Tailwind, elements hidden via `opacity-0 group-hover:opacity-100` become inaccessible to keyboard users because they cannot hover over the group.
**Action:** Always pair `group-hover:opacity-100` with `group-focus:opacity-100` or add `focus:opacity-100 focus:ring-2` if the element itself is interactive (like a button), ensuring screen reader and keyboard accessibility.

## 2025-06-05 - Drag Handles Accessibility
**Learning:** Drag handles (like sortable list buttons) require explicit `aria-label` attributes since visual icons like `ArrowsUpDownIcon` do not inherently convey their purpose to screen readers.
**Action:** Ensure drag handles have `aria-label`s like "Ubah urutan [Item Name]". Add `aria-hidden="true"` to decorative icons. Pair interaction with explicit `focus:ring-2` focus states.
## 2025-06-15 - Containers with Hover-Revealed Actions
**Learning:** When multiple interactive elements are wrapped inside a container hidden by `opacity-0 group-hover:opacity-100`, adding focus states to individual elements is not enough because their parent container remains invisible unless hovered.
**Action:** Always add `focus-within:opacity-100` to parent containers that reveal actions on hover, allowing the entire block of actions to become visible when any child element receives keyboard focus.
