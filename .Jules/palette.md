## 2024-04-16 - Focus States and Localization on Icon Buttons
**Learning:** React/Tailwind applications with localized interfaces must match `aria-label`s to the app's language (e.g., 'Tutup' instead of 'Close' for Indonesian apps), and icon-only buttons need explicit `focus-visible` or `focus:` outline states to be keyboard accessible.
**Action:** When adding ARIA labels to existing localized codebases, match the language of the surrounding UI. Always pair `aria-label` with `focus:outline-none focus:ring-2` to ensure the new accessible label is reachable by keyboard users.
