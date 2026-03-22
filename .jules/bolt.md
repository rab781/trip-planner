## 2026-03-22 - [N+1 Query in Collection Mapping]
**Learning:** Found a sneaky N+1 query bug inside a collection `map` callback `generateBadges`. The method queried `ItineraryItem::where('destination_id', $dest->id)->count()` on every iteration despite having the data pre-loaded in an external variable passed to the mapping function.
**Action:** Always verify if a required value inside a loop/mapping callback is already pre-calculated in the outer scope, and just pass it as an argument instead of making database queries inside a loop.
