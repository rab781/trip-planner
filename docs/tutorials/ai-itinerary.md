# Tutorial: Generate AI Itineraries in 5 Minutes

**What you'll build**: A complete, localized travel itinerary sorted by proximity and categorized by travel style.
**What you'll learn**:
- How to authenticate requests
- How to structure the AI itinerary generation payload
- How to test the endpoint locally

**Prerequisites**:
- [ ] Local environment setup (PHP, SQLite, Composer)
- [ ] A valid `CHUTES_API_TOKEN` in your `.env` file
- [ ] A Laravel Sanctum token (Bearer token)

---

## Step 1: Verify Environment Setup

First, ensure your AI token is configured. The generator service relies on the Chutes AI API.

1. Open your `.env` file.
2. Verify or add the following line:
   ```env
   CHUTES_API_TOKEN=your_actual_token_here
   ```
3. Restart your local server if it was running.

## Step 2: Authenticate User

The itinerary generation endpoint requires an authenticated user to save the resulting itinerary to the database. Generate or obtain a Sanctum Bearer token via your login endpoint.

## Step 3: Call the Generator Endpoint

You structure the request payload with constraints like the city, dates, pax count, transportation preference, and chosen destinations.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
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
    "pace": "normal",
    "budget_per_day": 500000,
    "solo_mode": false
  }'
```

You should receive a `200 OK` response with the `itinerary` ID, `destinations`, and cost breakdown.

> **Tip**: If you see a `500 Server Error` related to the API, ensure your `CHUTES_API_TOKEN` is correct. If you see `429 Too Many Requests`, wait a minute before retrying, as this endpoint is rate-limited to 5 requests per minute.

## Step 4: What You Built

You successfully authenticated and generated an AI-driven itinerary! Here's what you learned:
- **Environment config**: AI generation needs an active Chutes token.
- **Payload structure**: The endpoint expects strict validation parameters like `priority`, `pace`, and `transportation_preference`.

## Next Steps
- [Reference: Chatbot API](../reference/chatbot-api.md)
