# How-To: Generate AI-Powered Itineraries

This guide explains how to generate customized travel itineraries using the application's AI endpoints.

## Generating a Standard Itinerary

To generate an itinerary, make a POST request to `/api/itineraries/generate`. This endpoint requires a valid Sanctum bearer token.

### 1. Identify Your Destinations

You must provide an array of `destination_ids` that the user wants to visit, along with a `city_id` and a date range.

### 2. Make the Request

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "categories": ["sightseeing", "food"],
    "destination_ids": [1, 4, 7],
    "total_pax_count": 2
  }'
```

### 3. Handle the Response

The system will group your destinations by proximity and return a categorized daily plan along with estimated transport costs.

> **Note**: This endpoint is resource-intensive and is rate-limited to 5 requests per minute.
