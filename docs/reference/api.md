# API Reference

The Itinerary Management System provides a RESTful API for managing your travel planning needs.

## Authentication

All protected API endpoints require authentication via Laravel Sanctum. You must include your Sanctum Bearer token in the `Authorization` header of your requests.

```http
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

## Rate Limiting

To ensure high availability and fair usage, resource-intensive endpoints and AI features are strictly rate-limited.

### Standard Endpoints

Standard API endpoints (e.g., standard API responses that exceed a global rate limit) will return a standard `429 Too Many Requests` HTTP status and include a `Retry-After` header indicating how many seconds to wait before making another request.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
    "message": "Too Many Attempts."
}
```

### Chatbot Endpoints

The AI chatbot endpoints (`/api/chat` and `/api/chat/stream`) utilize a custom `chatbot.rate` middleware. Users are restricted to a maximum of 10 messages per minute.

If you exceed this limit, the API will return a `429 Too Many Requests` HTTP status along with a custom JSON payload, which includes a `retry_after` field (in seconds) in the response body instead of the standard `Retry-After` header.

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
    "success": false,
    "message": "Rate limit exceeded. Please try again later.",
    "retry_after": 60
}
```

### AI Itinerary Endpoints

Resource-intensive AI itinerary generation endpoints are also heavily rate-limited to prevent Denial of Wallet (DoW) attacks and resource exhaustion. This applies to:

- `POST /api/itineraries/generate`
- `POST /api/regenerate-day`
- `POST /api/suggest-replacement`

These endpoints use Laravel's standard `throttle` middleware (e.g., `throttle:5,1`).

## AI Itinerary Generation

The most powerful feature of the API is the AI-driven itinerary generation, which optimizes travel routes based on destinations, user categories, and budget constraints.

### Endpoint

`POST /api/itineraries/generate`

### Request Payload

This endpoint expects a JSON payload containing details about your desired itinerary. Note that this schema differs slightly from earlier examples, as it accurately reflects the actual controller validation rules.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `city_id` | Integer | Yes | The ID of the city for the itinerary (must exist in `cities` table) |
| `start_date` | Date (Y-m-d) | Yes | The starting date of the trip |
| `end_date` | Date (Y-m-d) | Yes | The ending date of the trip (must be on or after `start_date`) |
| `total_pax_count` | Integer | Yes | Total number of passengers/people in the group (minimum 1) |
| `transportation_preference` | String | Yes | Must be either `MOTOR` or `CAR` |
| `categories` | Array of Integers | Yes | A list of category IDs to guide AI generation (must exist in `categories` table) |
| `priority` | String | Yes | AI generation priority, must be one of: `balanced`, `budget`, `popular`, `rating` |
| `pace` | String | Yes | AI pacing preference, must be one of: `relaxed`, `normal`, `packed` |
| `budget_per_day` | Integer | No | Estimated budget per day (minimum 0) |
| `solo_mode` | Boolean | No | Indicates if the user is traveling alone |

### Example Request

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
    "categories": [1, 2, 4],
    "priority": "balanced",
    "pace": "normal"
  }'
```

### Response

The response will be a highly structured JSON object detailing the itinerary day-by-day, including estimated transport costs and grouped destinations based on zones and nearest-neighbor routing.

> Note: For a complete and interactive reference of all available API endpoints, requests, schemas, and responses, please consult the authoritative `openapi.yml` specification in the project root.
