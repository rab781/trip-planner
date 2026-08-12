# How-To: Generate an AI Itinerary

This guide shows you how to use the AI itinerary generation endpoint to automatically create an optimized travel schedule.

## Generating the Schedule

If you want the AI to generate an itinerary, use the `/api/itineraries/generate` endpoint. Provide your preferences, budget, and selected categories.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "total_pax_count": 2,
    "transportation_preference": "CAR",
    "categories": [1, 2],
    "priority": "balanced",
    "pace": "normal"
  }'
```

**Important Details**:
- `transportation_preference` accepts `MOTOR` or `CAR`.
- `priority` accepts `balanced`, `budget`, `popular`, or `rating`.
- `pace` accepts `relaxed`, `normal`, or `packed`.
- `categories` should be an array of category IDs.
