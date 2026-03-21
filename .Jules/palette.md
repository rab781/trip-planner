## 2026-03-21 - Chatbot Accessibility
**Learning:** Icon-only buttons in the floating chat and input form lacked screen reader support and keyboard focus indicators.
**Action:** Add `aria-label`, `aria-expanded`, and `focus-visible:ring` classes to interactive elements in React components to ensure they are accessible and visually clear when focused.
