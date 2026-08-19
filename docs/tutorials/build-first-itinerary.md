# Tutorial: Build Your First AI Itinerary in 15 Minutes

**What you'll build**: A complete, AI-generated travel itinerary for a multi-day trip using the Itinerary Management API.
**What you'll learn**:
- How to authenticate with the API
- How to retrieve available destinations and categories
- How to generate an AI-optimized itinerary

**Prerequisites**:
- [ ] curl or an API client (like Postman) installed
- [ ] Basic knowledge of REST APIs
- [ ] A local instance of the Itinerary Management API running on `http://localhost:8000`

---

## Step 1: Set Up Authentication

First, you need a Sanctum Bearer token to access the protected itinerary endpoints. Assuming you have a user account, you must authenticate.

For this tutorial, let's assume your token is `YOUR_SANCTUM_TOKEN`.

> **Tip**: If you haven't set up the project locally, follow the **Quick Start** guide in the project `README.md`.

## Step 2: Discover Destinations

Before generating an itinerary, you need to know which destinations you want to visit. The API provides endpoints to discover cities, zones, and destinations.

Fetch all cities:
```bash
curl -X GET http://localhost:8000/api/cities \
  -H "Accept: application/json"
```

Find destinations in your chosen city. For example, if City ID `1` is Bali:
```bash
curl -X GET http://localhost:8000/api/destinations \
  -H "Accept: application/json"
```
*Note down the IDs of destinations you want to include (e.g., 1, 4, 7).*

## Step 3: Check Available Categories

You also need to provide categories to help the AI optimize the trip.

```bash
curl -X GET http://localhost:8000/api/categories \
  -H "Accept: application/json"
```
*Note down category IDs (e.g., `1` for Sightseeing).*

## Step 4: Generate the Itinerary

Now, call the AI generation endpoint. You will provide the city, dates, pax count, categories, and your chosen destinations.

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
    "categories": [1, 2],
    "priority": "balanced",
    "pace": "normal",
    "solo_mode": false
  }'
```

You should receive a `200 OK` response with the generated itinerary, containing the optimal route and budget!

## Step 5: What You Built

You built a fully AI-optimized itinerary using the Itinerary API. Here's what you learned:
- **Authentication**: How to access protected endpoints.
- **Discovery**: How to find available destinations and categories.
- **Generation**: How to trigger the AI itinerary engine.

## Next Steps

- [Reference: Full API docs](../reference/api.md)
