# Tutorial: Create Your First Itinerary

**What you'll build**: A complete travel itinerary using the Itinerary Management API.

**What you'll learn**:
- How to retrieve available cities
- How to create a new itinerary

**Prerequisites**:
- [x] Local server running (`php artisan serve`)
- [x] Valid user authentication token

---

## Step 1: Get Available Cities
First, retrieve the list of available cities to find the `city_id` for your trip.

```bash
curl -X GET http://localhost:8000/api/cities \
  -H "Accept: application/json"
```

## Step 2: Create a Basic Itinerary
Create an empty itinerary for your trip. We'll use the basic `POST /api/itineraries` endpoint. The required fields are `name`, `city_id`, `start_date`, `end_date`, and `total_pax_count`.

```bash
curl -X POST http://localhost:8000/api/itineraries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "My First Trip",
    "city_id": 1,
    "start_date": "2025-10-01",
    "end_date": "2025-10-03",
    "total_pax_count": 2
  }'
```

## What You Built
You successfully queried the API for cities and created a new itinerary record.

## Next Steps
- See the [How-To Guide](how-to.md) for generating AI itineraries.
