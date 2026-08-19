# Explanation: The AI Itinerary Engine

The AI Itinerary Engine is the core feature that transforms a list of preferences into a structured, logistically optimized travel plan. This document explains the architecture and logic behind the generation process.

## How It Works

When a user requests a new itinerary, the engine performs several distinct phases:

### 1. Preference Gathering

The engine first collects user inputs via the `POST /api/itineraries/generate` endpoint. These inputs include:
- `city_id`: The destination city.
- `start_date` & `end_date`: Determines the total number of days available.
- `total_pax_count`: Number of travelers.
- `transportation_preference`: Determines distance and cost logic (`MOTOR` or `CAR`).
- `categories`: The types of activities the user enjoys (e.g., sightseeing, food).
- `priority`: Determines the AI's selection strategy (balanced, budget, popular, rating).
- `pace`: Determines how packed the daily schedule should be (relaxed, normal, packed).

### 2. Destination Selection

Based on the provided `categories` and `priority`, the engine queries the database to find suitable destinations within the specified `city_id`.

### 3. Spatial Grouping (Zoning)

To minimize travel time, the engine groups the selected destinations geographically. It attempts to assign destinations that belong to the same or neighboring zones to the same day.

### 4. Route Optimization

Within each day, the engine applies a nearest-neighbor sorting algorithm to order the destinations logically, minimizing the back-and-forth travel distance between consecutive stops.

### 5. Cost Estimation

Finally, the engine calculates the estimated transport cost. It calculates the distance between each ordered destination and multiplies it by the rate of the selected `transportation_preference`. This provides the user with a realistic budget breakdown for their trip.
