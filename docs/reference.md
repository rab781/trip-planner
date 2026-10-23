# Reference: API Core Concepts

## Authentication
All protected API routes require a Sanctum Bearer token in the `Authorization` header.

```http
Authorization: Bearer 1|abcdef123456...
```

## Rate Limiting
To prevent abuse, Chatbot API routes (`/api/chat` and `/api/chat/stream`) are protected by the `chatbot.rate` middleware.
- **Rate Limit**: 10 messages per minute.
- **Rate Limit Exceeded**: Returns a `429 Too Many Requests` response.
- A `Retry-After` header will indicate the seconds until the rate limit resets.

## Errors
The API uses standard HTTP status codes, as defined in the OpenAPI schema:
- `200/201`: Success
- `400`: Bad Request / Validation Error (`ValidationError`)
- `401`: Unauthorized (`Unauthorized`)
- `403`: Forbidden (`Forbidden`)
- `404`: Not Found (`NotFound`)
- `429`: Rate Limit Exceeded (`RateLimitExceeded`)
