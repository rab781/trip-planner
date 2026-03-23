## 2024-03-23 - Accessibility in Floating UI Components
**Learning:** Icon-only buttons in floating UI widgets (like chat toggles) frequently lack accessible names, making them invisible to screen readers despite their prominent visual position. The dynamic nature of these widgets requires state-aware labels (e.g., toggling between "Open chat" and "Close chat").
**Action:** Always ensure that any floating action button (FAB) or icon-only interactive element has a clear `aria-label`, and if the button toggles state, update the label to reflect the current state.
