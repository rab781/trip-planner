# Tutorial: Create Your First Itinerary in 5 Minutes

**What you'll build**: A 3-day itinerary for Bali with auto-calculated transport costs.

**What you'll learn**:
- Creating an itinerary
- Adding destinations
- Reordering items

**Prerequisites**:
- [ ] Local environment set up (see README)
- [ ] Authenticated user account

---

## Step 1: Create the Itinerary Base

First, create the main itinerary record.

```bash
curl -X POST http://localhost:8000/api/itineraries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bali Trip 2025",
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "total_pax_count": 2
  }'
```

## Step 2: Sync Destinations

Next, add destinations to the itinerary.

```bash
curl -X PUT http://localhost:8000/api/itineraries/1/sync-items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_ids": [1, 2, 3]
  }'
```

## What You Built

You built a complete itinerary! Here's what you learned:
- **Itinerary Creation**: How to set the foundational details.
- **Destination Sync**: How to attach places to visit.
