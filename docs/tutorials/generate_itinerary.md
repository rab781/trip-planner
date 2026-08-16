# Tutorial: Generate Your First Itinerary in 10 Minutes

**What you'll build**: A complete, AI-optimized daily itinerary using the system's API endpoints. You'll authenticate, fetch necessary reference data, and submit a generation request to create a practical, day-by-day travel plan.

**What you'll learn**:
- How to authenticate using Laravel Sanctum
- How to retrieve required reference IDs (Cities, Categories)
- How to structure the `POST /api/itineraries/generate` payload
- How to interpret the AI-generated response

**Prerequisites**:
- [ ] A local running instance of the application (see README.md)
- [ ] A valid user account in the system
- [ ] The `CHUTES_API_TOKEN` environment variable configured
- [ ] cURL or a tool like Postman

---

## Step 1: Authenticate and Get a Token

First, you need to obtain a Bearer token to authorize your requests. We'll use the standard login endpoint.

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "your_email@example.com",
    "password": "your_password"
  }'
```

You should see a response containing your token:
```json
{
  "token": "1|abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

> **Tip**: Save this token. You will need to include it in the `Authorization` header for all subsequent requests as `Bearer <token>`.

## Step 2: Fetch Reference Data

The AI generator requires specific IDs for the city and the categories you want to explore. Let's fetch those first.

### Get City IDs

```bash
curl -X GET http://localhost:8000/api/cities \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Accept: application/json"
```

Find the ID of the city you want to visit (e.g., `1` for Jakarta).

### Get Category IDs

```bash
curl -X GET http://localhost:8000/api/categories \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Accept: application/json"
```

Pick a few category IDs that match your interests (e.g., `1` for Culture, `3` for Food).

## Step 3: Generate the Itinerary

Now, assemble your generation request using the IDs you gathered in Step 2. The endpoint requires several specific parameters to guide the AI, such as pacing, priority, and transportation preference.

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
    "transportation_preference": "MOTOR",
    "categories": [1, 3],
    "priority": "balanced",
    "pace": "normal"
  }'
```

This request might take a few moments to process, as the AI groups destinations, calculates distances, and optimizes the route.

## Step 4: What You Built

If successful, you will receive a 201 response containing your fully generated itinerary!

You successfully navigated the API to build a multi-day travel plan. Here's what you learned:
- **Authentication**: How to obtain and use Sanctum Bearer tokens.
- **Reference Lookups**: Why relying on ID references rather than raw text helps the system remain strict and fast.
- **AI Generation Payload**: The required constraints (like pace and priority) that power the AI algorithms.

## Next Steps

- Explore how to [Regenerate a specific day](../reference/api.md#ai-itinerary-endpoints) if the suggestions aren't quite right.
- Review the [Full API Reference](../reference/api.md) for all available options and error codes.
