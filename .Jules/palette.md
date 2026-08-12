## 2026-03-25 - Improved accessibility and focus states for ItineraryCard buttons
**Learning:** Hidden interactive elements (like the "Remove" button in `ItineraryCard`) that are only revealed on hover (`opacity-0 group-hover:opacity-100`) break keyboard navigation if they lack focus states. Screen readers also struggle with icon-only toggle buttons (like "Expand Tickets") without dynamic `aria-label` or `aria-expanded` attributes.
**Action:** When implementing "reveal-on-hover" buttons, always pair hover states with focus states (`focus:opacity-100 focus:outline-none focus:ring-2`) so keyboard users can discover and interact with them. Add `aria-hidden="true"` to purely decorative SVG icons within these buttons.

## 2025-06-01 - Focus States on Hover-Hidden Elements
**Learning:** In Tailwind, elements hidden via `opacity-0 group-hover:opacity-100` become inaccessible to keyboard users because they cannot hover over the group.
**Action:** Always pair `group-hover:opacity-100` with `group-focus:opacity-100` or add `focus:opacity-100 focus:ring-2` if the element itself is interactive (like a button), ensuring screen reader and keyboard accessibility.

## 2025-06-05 - Drag Handles Accessibility
**Learning:** Drag handles (like sortable list buttons) require explicit `aria-label` attributes since visual icons like `ArrowsUpDownIcon` do not inherently convey their purpose to screen readers.
**Action:** Ensure drag handles have `aria-label`s like "Ubah urutan [Item Name]". Add `aria-hidden="true"` to decorative icons. Pair interaction with explicit `focus:ring-2` focus states.
## 2026-04-10 - Screen Reader Redundancy in Icon-Only Buttons
**Learning:** Icon-only buttons with nested SVG icons (like Heroicons) often cause screen readers to announce both the `aria-label` on the button AND attempt to read the SVG contents, creating noisy, redundant announcements. Additionally, input fields lacking a visible label or `id`/`htmlFor` association are completely inaccessible without an explicit `aria-label`.
**Action:** When implementing icon-only buttons, always add `aria-hidden="true"` directly to the `<svg>` or icon component to hide it from the accessibility tree, while ensuring the parent `<button>` has a descriptive `aria-label`. Always provide an `aria-label` for standalone inputs like chat text boxes.
## 2026-07-09 - aria-pressed on toggle buttons
**Learning:** Toggle buttons that use visual styles (like background colors or shadows) to indicate their active state do not automatically convey this information to screen readers.
**Action:** Always add `aria-pressed={condition}` to view toggle buttons (e.g., Map vs List views) to ensure their active state is explicitly communicated to assistive technologies.
