## 2026-03-25 - Improved accessibility and focus states for ItineraryCard buttons
**Learning:** Hidden interactive elements (like the "Remove" button in `ItineraryCard`) that are only revealed on hover (`opacity-0 group-hover:opacity-100`) break keyboard navigation if they lack focus states. Screen readers also struggle with icon-only toggle buttons (like "Expand Tickets") without dynamic `aria-label` or `aria-expanded` attributes.
**Action:** When implementing "reveal-on-hover" buttons, always pair hover states with focus states (`focus:opacity-100 focus:outline-none focus:ring-2`) so keyboard users can discover and interact with them. Add `aria-hidden="true"` to purely decorative SVG icons within these buttons.

## 2025-06-01 - Focus States on Hover-Hidden Elements
**Learning:** In Tailwind, elements hidden via `opacity-0 group-hover:opacity-100` become inaccessible to keyboard users because they cannot hover over the group.
**Action:** Always pair `group-hover:opacity-100` with `group-focus:opacity-100` or add `focus:opacity-100 focus:ring-2` if the element itself is interactive (like a button), ensuring screen reader and keyboard accessibility.

## 2026-04-01 - Drag handles require explicit aria-labels and focus styles
**Learning:** Interactive drag handles (often represented visually by "grip" icons without text) must have explicit `aria-label` attributes to convey their purpose to screen reader users. Additionally, since they receive keyboard focus, they must have visible focus styles (like `focus:ring-2`) instead of just visual cues indicating interactivity on hover or grab.
**Action:** Always add an `aria-label` and tailwind `focus:outline-none focus:ring-2` classes to custom drag handles to make them accessible.
