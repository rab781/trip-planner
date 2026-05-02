
## 2024-05-02 - Floating Action Buttons Need Explicit Focus & ARIA
**Learning:** Absolute positioned floating action buttons (like map control overlays) are easy to miss for screen readers if they lack `aria-label` and `aria-hidden` on inner SVG icons. Additionally, they must have visible focus states (e.g. `focus:ring-2`) because absolute positioning often disrupts natural tab order context, making visual focus tracking critical for keyboard users.
**Action:** Always verify that absolute positioned, icon-only buttons include an explicit `aria-label` and `focus:outline-none focus:ring-2 focus:ring-[color]` classes for robust accessibility.
