## 2026-04-21 - Accessibility improvements to custom input controls
**Learning:** Custom increment/decrement number controls often miss basic accessibility features like `aria-label` and keyboard focus, making them invisible to screen readers.
**Action:** Always add `aria-label`, `id`/`htmlFor` mappings, disabled states, and explicit `focus:ring` classes when building or refactoring custom form controls.
