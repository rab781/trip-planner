
## 2024-04-24 - Accessible Map Overlays
**Learning:** Absolute positioned icon-only controls (like floating action buttons on maps) are frequently missed by screen readers and keyboard navigation if they lack `aria-label` and visible focus states, which breaks accessibility for critical interactive elements overlaying visual maps.
**Action:** Always ensure absolute positioned FABs or icon-only map controls have an explicit `aria-label`, set `aria-hidden="true"` on the decorative SVG, and include robust focus states like `focus:outline-none focus:ring-2 focus:ring-offset-2` to guarantee they are discoverable and usable by everyone.
