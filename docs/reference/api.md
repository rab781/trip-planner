# API Reference

This document provides a comprehensive reference for the Itinerary Management API, including authentication, rate limiting, and core endpoints.

## Authentication

Protected routes require a Sanctum Bearer token in the `Authorization` header.

```http
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

## Rate Limiting

The Chatbot API uses a custom rate limiter to prevent abuse and Denial of Wallet (DoW) attacks.
Requests are limited to **10 messages per minute per user** (or IP address if unauthenticated).

When the limit is exceeded, the API responds with a `429 Too Many Attempts` status code and a JSON payload, **not** standard HTTP `Retry-After` headers.

**Rate Limit Exceeded Response Format:**

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 45 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 45
}
```

*Note: The AI itinerary generation endpoints (`/api/itineraries/generate`, `/regenerate-day`, `/suggest-replacement`) are also rate-limited to 5 requests per minute (`throttle:5,1`).*

## Core Endpoints

### AI Chatbot

#### `POST /api/chat`
Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "What is a good 3-day itinerary for Bali?"
}
```

#### `POST /api/chat/stream`
Send a message to the AI chatbot and receive a streamed response (Server-Sent Events).

**Request Body:**
```json
{
  "message": "Suggest some activities in Jakarta."
}
```

### AI Itinerary Generation

#### `POST /api/itineraries/generate`
AI-generate an optimized itinerary based on inputs like city, dates, pax count, transportation preference, and chosen categories.

**Request Body:**
```json
{
  "city_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-03",
  "total_pax_count": 2,
  "transportation_preference": "MOTOR",
  "categories": [1, 2],
  "priority": "balanced",
  "pace": "normal",
  "solo_mode": false
}
```

*For complete endpoint details, request and response schemas, please refer to the OpenAPI specification (`openapi.yml`) in the root directory.*
