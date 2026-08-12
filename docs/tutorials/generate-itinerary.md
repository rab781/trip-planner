# Tutorial: Generate Your First AI Itinerary in 10 Minutes

**What you'll build**: You will use the API to generate an optimized, multi-day AI travel itinerary based on selected destinations.

**What you'll learn**:
- How to authenticate with the API
- How to format an itinerary generation request
- How the AI groups and sorts your destinations

**Prerequisites**:
- [ ] Local environment set up (see `README.md` Quick Start)
- [ ] A valid User account in your local database
- [ ] A tool like `curl`, Postman, or Thunder Client

---

## Step 1: Get Your Access Token

First, you need to authenticate as a user to get a Sanctum Bearer token. If you haven't created a user yet, you can register one via the frontend or use a factory in `php artisan tinker`.

Assuming you have a user with email `user@example.com` and password `password`:

```bash
curl -X POST http://localhost:8000/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```
*(Note: In a standard Laravel setup, login might set cookies. If using an API-specific token route, you would use `/api/tokens/create` or similar depending on implementation.)*

Copy the token provided in the response or use cookie-based session auth if running inside a browser environment.

## Step 2: Identify Your Destinations

You need to know the IDs of the city and destinations you want to visit. You can fetch them from the public API:

```bash
curl http://localhost:8000/api/destinations -H "Accept: application/json"
```

Let's say you chose destinations with IDs `1, 4, 7, and 12` in City ID `1`.

## Step 3: Send the Generation Request

Now, make a POST request to the `/api/itineraries/generate` endpoint. Replace `YOUR_TOKEN_HERE` with your actual Sanctum token.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
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

## Step 4: What You Built

If successful, you will receive a `200 OK` response containing a fully formed itinerary. The AI has grouped your chosen destinations by geographic zone and sorted them to minimize travel time!

You learned:
- **Authentication**: How to access protected endpoints.
- **AI Generation**: How to pass parameters to the AI engine to get customized travel plans.

## Next Steps

- [Reference: Full API docs](../../openapi.yml)
- [Explanation: How proximity sorting works](../explanation/proximity-sorting.md) (Coming soon)
