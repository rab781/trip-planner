## 2026-04-18 - Accessibility on Toggle Buttons
**Learning:** Collapsible sections like the `BudgetSummary` require both `aria-expanded` and an `id` coupling via `aria-controls` to be fully semantic. When buttons contain visible text, rely on that text and `aria-expanded` state, hiding inner icons from screen readers, rather than replacing everything with a generic `aria-label`.
**Action:** When adding collapsible panels, always ensure the trigger `<button>` has `aria-expanded={isExpanded}`, `aria-controls="panel-id"`, and the content container has `id="panel-id"`.
