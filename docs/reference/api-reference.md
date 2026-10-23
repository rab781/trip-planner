# API Reference Overview

The Itinerary Management System provides a comprehensive RESTful JSON API. For the complete, authoritative specification, view `openapi.yml` at the project root.

## Authentication

All protected routes require a Bearer token in the `Authorization` header.
```
Authorization: Bearer <your-sanctum-token>
```

## Key Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/cities` | GET | List available cities |
| `/api/destinations` | GET | List available destinations |
| `/api/itineraries/generate` | POST | AI-generate an itinerary (requires Auth) |
| `/api/chat` | POST | Chat with the AI travel assistant |

## Chatbot Rate Limiting

The `/api/chat` and `/api/chat/stream` endpoints are protected by the `chatbot.rate` middleware. Users are limited to 10 messages per minute.

When the limit is exceeded, the server returns an HTTP 429 response with a custom JSON payload:

```json
{
  "success": false,
  "message": "Too Many Attempts.",
  "retry_after": 60
}
```

## Error Handling

Standard validation errors return an HTTP 400 response with detailed field messages:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "city_id": ["The city id field is required."]
  }
}
```
