# How-To: Generate an AI Itinerary

This guide explains how to use the `/api/itineraries/generate` endpoint to create a complete, multi-day optimized itinerary.

## Prerequisites
- You have an authenticated Sanctum token.
- You know the ID of the city you are visiting.
- You have selected destination IDs you want to include.

## Step 1: Prepare the Request Payload

The API requires `city_id`, dates, categories, destination IDs, and `total_pax_count`.

```json
{
  "city_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-03",
  "categories": ["sightseeing", "food", "nightlife"],
  "destination_ids": [1, 4, 7, 12],
  "total_pax_count": 2
}
```

## Step 2: Make the Request

Send a POST request to the API.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "categories": ["sightseeing", "food", "nightlife"],
    "destination_ids": [1, 4, 7, 12],
    "total_pax_count": 2
  }'
```

## Handling the Response

A successful response (HTTP 200) returns an `Itinerary` object containing sequenced destination items and calculated costs. If the AI generator fails, it may return a validation error (HTTP 400).

```json
{
  "id": 1,
  "name": "Trip to Bali",
  "total_pax_count": 2,
  "items": [
     { "destination_id": 1, "sequence": 1 }
  ]
}
```
