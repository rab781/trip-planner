# Explanation: The AI Routing Algorithm

The Itinerary Management System isn't just a simple wrapper around a Large Language Model (LLM). It uses a hybrid approach combining deterministic geographical algorithms with AI-driven contextual selections.

This document explains the architecture behind the `POST /api/itineraries/generate` endpoint.

## The Problem with Pure LLM Itineraries

If you ask a standard LLM to "plan a 3-day trip to Tokyo", it will likely produce a list of popular spots. However, it often fails at:
1. **Spatial Awareness:** It might suggest visiting a temple in the far north in the morning, a museum in the far south at noon, and a restaurant back in the north for dinner—resulting in hours wasted in transit.
2. **Data Grounding:** It might suggest restaurants that have closed permanently or attractions that don't match your local database of bookable/verifiable destinations.
3. **Pacing:** It struggles to estimate realistic travel times based on chosen transportation (e.g., car vs. walking).

## The Hybrid Architecture

Our system solves these issues by treating the LLM as a "selector" and the backend as a "router."

### Phase 1: Contextual Filtering (The Backend)
When a request is received, the system first filters the local database based on the user's hard constraints:
- `city_id`
- `categories` (e.g., only return destinations tagged as "food" and "culture")

### Phase 2: Selection & Grouping (The AI)
The filtered list of valid destinations, along with their zone information and the user's soft constraints (`pace`, `priority`, `total_days`), is passed to the Chutes AI model.

The AI's job is **not** to order the day, but to select the *best* subset of destinations for the user and group them logically by day, attempting to keep destinations in the same zone on the same day.

### Phase 3: Nearest-Neighbor Routing (The Backend)
Once the AI returns a selected set of destinations grouped by day, the backend takes over again.

For each day, the backend applies a greedy nearest-neighbor algorithm based on the geographic coordinates (latitude/longitude) of the destinations.
1. It selects a starting point.
2. It finds the next closest destination geographically.
3. It estimates the transit time and cost based on the `transportation_preference` (`MOTOR` or `CAR`) and the `total_pax_count`.
4. It repeats this process until all destinations for that day are ordered.

## Why This Matters

This architecture guarantees that:
- Every suggested destination actually exists in the local database.
- Travel time is minimized because the routing is calculated deterministically, not guessed by the AI.
- Costs and transit times are calculated using real-world formulas rather than hallucinated estimates.

By separating the "creative selection" from the "logical routing", the system provides itineraries that are both highly personalized and practically achievable.
