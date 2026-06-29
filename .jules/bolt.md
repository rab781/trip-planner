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
## 2026-04-06 - Prevent N+1 queries in loop-mapped operations by pre-fetching relations in maps
**Learning:** Using `Model::find($id)` inside loops (e.g. iterating over itinerary items or days in a controller request) causes a severe N+1 query problem, because a separate DB query is executed for each item.
**Action:** Always pre-fetch the required models outside the loop by extracting all necessary IDs into an array, executing a single query like `Model::whereIn('id', $ids)->get()->keyBy('id')`, and then querying from that Map/Dictionary inside the loop.
## 2026-04-12 - Replacing Sequential Updates with Bulk Upsert
**Learning:** When resolving N+1 update query bottlenecks by replacing `$model->update()` with `Model::upsert()`, be cautious that bulk operations bypass Eloquent lifecycle events (`saving`, `updated`, `touches`). I learned to explicitly check for `Observers` and `$touches` configurations on the target model before proceeding with this optimization to ensure no side effects are missed.
**Action:** Always run `grep -rn "Observer" app/` and check the model file for `$touches` before refactoring loops containing Eloquent create/update calls into bulk `insert()` or `upsert()`.
## 2026-04-18 - Prevent N+1 Update Queries with Bulk whereIn
**Learning:** Performing multiple individual `Model::where('id', $id)->update(...)` queries inside a loop to update a shared value (like a specific `day_number` for multiple items) causes an N+1 query bottleneck for database writes.
**Action:** Extract the target entity IDs (e.g. using `$collection->pluck('id')->toArray()`) and execute a single bulk update query `Model::whereIn('id', $ids)->update(['attribute' => $sharedValue])`. This keeps writes highly efficient while maintaining data integrity.
## 2026-05-19 - N+1 Queries Triggered by API JSON Serialization and Appends
**Learning:** In Laravel, defining a computed attribute in the `$appends` array of a model (e.g. `estimated_budget` on `Itinerary`) forces the accessor to execute whenever the model is serialized (like returning a JSON response). If that accessor relies on relationships (like `itineraryLodgings`), those relationships must be explicitly included in the `with()` array of the controller query fetching the collection. Failing to do so triggers an N+1 lazy-loading query for every model serialized in the response.
**Action:** When a model utilizes `$appends` that access relationships, ensure all controllers returning collections of that model via API responses eagerly load those exact relationships using `with(...)`.
## 2026-05-27 - Caching Reference Datasets
**Learning:** Passing large static reference datasets to Inertia React components without caching causes high database querying and JSON serialization overhead.
**Action:** Always wrap static reference datasets in Cache::remember with a short TTL for micro-caching.
