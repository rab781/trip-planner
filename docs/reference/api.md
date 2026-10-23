# API Reference

The Itinerary Management System API allows you to manage cities, zones, destinations, categories, itineraries, and interact with an AI chatbot.

## Base URL
All API requests should be prefixed with the base URL: `http://localhost:8000/api`

## Authentication
Protected routes require a Sanctum Bearer token in the `Authorization` header. You get your token by authenticating through the standard login flow.

```bash
# Example
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:8000/api/itineraries
```

## Rate Limiting
Chatbot endpoints (`/chat` and `/chat/stream`) are protected by the `chatbot.rate` middleware which limits requests to 10 messages per minute. Rate limit headers are included in every response.
If you exceed the limit, you receive a `429 Too Many Requests` error.

## Error Handling
The API returns standard HTTP status codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid request data. Check the `message` and `errors` fields in the response.
- `401 Unauthorized`: Authentication failed or missing token.
- `403 Forbidden`: You don't have permission to perform this action.
- `404 Not Found`: Resource not found.
- `422 Unprocessable Entity`: Validation failed. Check the `errors` field in the response.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Server error.

### Error Response Format
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "city_id": [
      "The city id field is required."
    ]
  }
}
```

## AI Itinerary Generation

### Generate an Itinerary
AI-generates an optimized itinerary based on inputs like city, dates, pax count, and chosen destinations. This endpoint uses rate limiting to prevent abuse.

`POST /itineraries/generate`

#### Request Body
- `city_id` (integer, required): ID of the city (e.g., 1)
- `start_date` (string format date, required): e.g. "2025-06-01"
- `end_date` (string format date, required): e.g. "2025-06-03"
- `categories` (array of strings, required): e.g. ["sightseeing", "food", "nightlife"]
- `destination_ids` (array of integers, required): e.g. [1, 4, 7, 12]
- `total_pax_count` (integer, required): e.g. 2

#### Example Request
```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
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

#### Example Success Response (200 OK)
```json
{
  "id": 1,
  "name": "Bali Trip 2025",
  "user_id": 1,
  "city_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-03",
  "total_pax_count": 2,
  "items": [
    {
      "id": 1,
      "destination_id": 1,
      "sequence": 1
    }
  ]
}
```

For the complete API reference, please refer to the OpenAPI specification (`openapi.yml`).
