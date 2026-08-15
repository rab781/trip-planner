# API Reference

The Itinerary Management System provides a comprehensive RESTful JSON API. Our API endpoints are categorized below with specific focus on expected request payloads, valid responses, and rate limit structures.

All API routes require authentication via a Laravel Sanctum Bearer Token, passed in the `Authorization` header, except for public data endpoints (like cities or categories). The base URL is `/api`.

## 1. Authentication & Rate Limiting
- **Authentication**: Provide `Authorization: Bearer <token>` in the header for protected routes.
- **Rate Limiting**: Our Chatbot API routes are rate-limited to 10 messages per minute. If you exceed this, you will receive a `429 Too Many Attempts` response with a custom JSON payload. See [Error Responses](#error-responses) below.

## 2. Endpoints

### Generate Itinerary
`POST /api/itineraries/generate`

Generates an optimized AI itinerary.
Requires specific details. Note that `categories` expects an array of category IDs, and `transportation_preference`, `priority`, and `pace` are strictly enforced strings.

**Request Payload:**
```json
{
  "city_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-03",
  "total_pax_count": 2,
  "transportation_preference": "CAR",
  "categories": [1, 2],
  "priority": "balanced",
  "pace": "relaxed",
  "budget_per_day": 100,
  "solo_mode": false
}
```

### Regenerate Day
`POST /api/itineraries/regenerate-day`

Asks the AI to regenerate a specific day of an itinerary with alternative suggestions.

**Request Payload:**
```json
{
  "city_id": 1,
  "day_number": 2,
  "total_days": 3,
  "total_pax_count": 2,
  "transportation_preference": "CAR",
  "categories": [1],
  "priority": "budget",
  "pace": "normal",
  "exclude_ids": [5, 12],
  "solo_mode": false
}
```

### Suggest Replacement
`POST /api/itineraries/suggest-replacement`

Fetches AI suggestions to replace a specific destination inside an itinerary.

**Request Payload:**
```json
{
  "city_id": 1,
  "exclude_id": 5,
  "category_id": 2,
  "priority": "popular",
  "solo_mode": false,
  "limit": 5
}
```

## Error Responses

The application generally returns standard 400-level HTTP status codes.

### Rate Limit Exceeded (429)

Unlike standard web endpoints that return `Retry-After` HTTP headers, the Chatbot API endpoints specifically return a custom JSON payload on `429`:

```json
{
  "success": false,
  "message": "Rate limit exceeded.",
  "retry_after": 60
}
```
