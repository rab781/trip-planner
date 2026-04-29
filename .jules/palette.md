## 2024-05-14 - Accessible Collapsible Sections
**Learning:** Collapsible sections like the Budget Summary often lack `aria-expanded` and descriptive `aria-label`s, as well as clear focus styling, making them difficult for keyboard and screen reader users to navigate effectively.
**Action:** Always ensure that collapsible toggles include `aria-expanded` that correctly matches the state, dynamic `aria-label`s if the button contents aren't inherently descriptive of the action, and robust `focus:outline-none focus:ring-2` styling.
