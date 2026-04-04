## 2024-05-24 - N+1 in Services via `load`
**Learning:** Calling `$model->load(...)` within a shared service class (like `ItineraryService`) forcibly triggers database queries every time it's called, even if the caller (like a Controller) already eager-loaded those relationships. In an index view rendering multiple models, this accidentally re-introduces an N+1 query problem.
**Action:** Use `$model->loadMissing(...)` in services when ensuring required relations exist to safely respect data eager-loaded by the caller.
## 2026-03-24 - Prevent N+1 query loop when using nested relationships in loops
**Learning:** In Laravel, `$model->load()` always executes a query, even if the data was already eager-loaded in the controller. This causes severe N+1 query problems in operations looping over collections (like budget calculations on an index page).
**Action:** Always use `$model->loadMissing()` instead of `$model->load()` in shared services where models might already contain eager-loaded data from controllers. Additionally, explicitly eager-load deep nested relationships (e.g. `itineraryItems.destination.ticketVariants`) in the controller's `with()` method to allow `loadMissing()` to completely skip database calls.
## 2026-03-25 - Prevent N+1 queries in nested loops via memoization
**Learning:** Services like `ItineraryGeneratorService` call other utility services (e.g. `TransportService::calculateTransportCost`) repeatedly inside nested loops (like calculating costs for each destination per day). If the utility service queries the DB on each call (`TransportRate::where(...)`), it silently causes an N+1 bottleneck that isn't immediately obvious because the DB call is encapsulated inside the helper method.
**Action:** Always memoize DB lookups inside utility services using class-level properties when the data (like transport rates) doesn't change during the lifecycle of the request.
## 2026-03-27 - Prevent N+1 queries in loop-mapped operations by reusing pre-calculated statistics
**Learning:** Performing database queries (like `count()`) inside mapping functions that iterate over collections (e.g., generating badges for destinations) causes N+1 query loops.
**Action:** When a statistic (like popularity score) is already calculated and passed to the method (or available in the context), reuse it instead of querying the database again. For example, replace `Model::where()->count()` with a simple check on the pre-calculated array value (`$scores['popularity'] >= 75`).
## $(date +%Y-%m-%d) - Pre-fetch Eloquent collections for bulk operations
**Learning:** During bulk operations (like syncing or creating many itinerary items), placing `Model::find($id)` inside nested loops results in severe N+1 query bottlenecks that scale linearly with the number of items.
**Action:** Always extract unique IDs into an array, execute a single `Model::whereIn('id', $ids)->get()->keyBy('id')` query before the loop, and use `$map->get($id)` for in-memory O(1) lookups.
