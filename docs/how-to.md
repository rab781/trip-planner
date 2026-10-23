# How-To: Generate Itineraries with AI

This guide explains how to use the AI generation endpoint.

## Generate an Itinerary

Send a POST request to `/api/itineraries/generate` with your parameters.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "categories": ["sightseeing"],
    "destination_ids": [1, 4, 7],
    "total_pax_count": 2
  }'
```

The system will group your destinations by zone and sort them for optimal travel time.
