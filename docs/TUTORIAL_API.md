# Tutorial: Generating Your First Itinerary in 5 Minutes

**What you'll build**: You'll learn how to successfully make your first `POST` request to the AI Itinerary Generator endpoint to create a multi-day trip plan.

**What you'll learn**:
- How to structure the AI request payload.
- Which fields are strictly required by the backend.

**Prerequisites**:
- [ ] A local instance of the Itinerary Management System running.
- [ ] A valid Sanctum Bearer token for authentication.
- [ ] `curl` or Postman installed.

---

## Step 1: Prepare the Required Data

First, you need to understand exactly what the generator requires. Our API requires specific parameters:
- `city_id` (integer)
- `start_date` and `end_date` (YYYY-MM-DD strings)
- `total_pax_count` (integer)
- `transportation_preference` (strictly `"MOTOR"` or `"CAR"`)
- `categories` (array of category IDs)
- `priority` (strictly `"balanced"`, `"budget"`, `"popular"`, or `"rating"`)
- `pace` (strictly `"relaxed"`, `"normal"`, or `"packed"`)

Let's say we want to travel to City ID 1 (e.g., Bali), traveling by car, checking out categories 1 and 2, prioritizing budget, at a relaxed pace.

## Step 2: Make the API Call

We'll use `curl` to make the request. Ensure you replace `YOUR_TOKEN_HERE` with your actual Bearer token.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "total_pax_count": 2,
    "transportation_preference": "CAR",
    "categories": [1, 2],
    "priority": "budget",
    "pace": "relaxed",
    "solo_mode": false
  }'
```

You should see output returning a full itinerary object containing days and specific destinations!

## Step 3: What You Built

You successfully called the core AI generation engine! Here's what you learned:
- **Strict Validation**: The API enforce exact strings for `transportation_preference`, `priority`, and `pace`.
- **Payload Structure**: Dates and IDs must be formatted correctly.

## Next Steps

- [Reference: Full API docs](./API_REFERENCE.md)
