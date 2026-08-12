# API Reference

This document provides a reference for the core REST APIs, focusing on AI generation and rate limits.

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header, obtained via Laravel Sanctum.

## Rate Limiting

To protect against resource exhaustion, the following rate limits are strictly enforced:
- **Chatbot API**: 10 requests per minute (`chatbot.rate` middleware).
- **AI Itinerary Generation**: 5 requests per minute (`throttle:5,1` middleware).

If you exceed these limits, you will receive a `429 Too Many Requests` response.

## Core Endpoints

### Generate Itinerary

Creates an optimized daily itinerary based on selected destinations.

- **URL**: `/api/itineraries/generate`
- **Method**: `POST`
- **Auth required**: Yes
- **Rate Limit**: 5 req/min

#### Request Body
```json
{
  "city_id": 1,
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "categories": ["string"],
  "destination_ids": [1, 2, 3],
  "total_pax_count": 2
}
```

### Regenerate Day

Regenerates a specific day within an existing itinerary.

- **URL**: `/api/itineraries/regenerate-day`
- **Method**: `POST`
- **Auth required**: Yes
- **Rate Limit**: 5 req/min

For comprehensive schemas, refer to the [openapi.yml](../../openapi.yml) file in the root directory.
