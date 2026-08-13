# Tutorial: Generate an AI Itinerary in 10 Minutes

**What you'll build**: A fully automated script to generate personalized travel itineraries using our AI endpoint.
**What you'll learn**:
- How to authenticate your request
- Required parameters for the AI generator
- Handling the JSON response

**Prerequisites**:
- [ ] A local instance of the application running.
- [ ] A valid Sanctum Bearer token.
- [ ] The `CHUTES_API_TOKEN` configured in your `.env`.

---

## Step 1: Prepare Your Payload

First, you need to construct the JSON payload. The AI generator requires specific details about the trip to optimize the schedule.

Create a file named `payload.json`:
```json
{
  "city_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-03",
  "total_pax_count": 2,
  "transportation_preference": "CAR",
  "categories": [1, 2, 3],
  "priority": "balanced",
  "pace": "normal"
}
```

## Step 2: Make the Request

Send a POST request to the `/api/itineraries/generate` endpoint with your bearer token.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @payload.json
```

## Step 3: What You Built

You successfully triggered the nearest-neighbor algorithm and AI processing engine to construct a daily itinerary. Here's what you learned:
- **Payload Structure**: The essential properties (`city_id`, `transportation_preference`, etc.) needed for generation.
- **Authentication**: Using a Sanctum token to protect resource-intensive endpoints.

## Next Steps

- [Reference: Chatbot API Reference](../reference/chatbot-api.md)
- [Reference: Full API docs](../../openapi.yml)
