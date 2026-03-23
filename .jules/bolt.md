## 2024-05-24 - N+1 in Services via `load`
**Learning:** Calling `$model->load(...)` within a shared service class (like `ItineraryService`) forcibly triggers database queries every time it's called, even if the caller (like a Controller) already eager-loaded those relationships. In an index view rendering multiple models, this accidentally re-introduces an N+1 query problem.
**Action:** Use `$model->loadMissing(...)` in services when ensuring required relations exist to safely respect data eager-loaded by the caller.
