# Chatbot API Reference

The Chatbot API provides conversational AI capabilities for travel planning and recommendations.

## Authentication

All requests to the Chatbot API endpoints can optionally include a Sanctum Bearer token for personalized context, though they can also be accessed without authentication (rate limiting is applied via IP).

## Rate Limiting

To prevent abuse and manage API costs, Chatbot endpoints use a custom rate limiter:
- **Limit**: 10 messages per minute per user/IP.
- **HTTP Status**: Returns `429 Too Many Requests` when exceeded.

### Rate Limit Response Payload
Unlike standard Laravel rate limiting which returns a `Retry-After` HTTP header, this endpoint returns a specific JSON payload:

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 58 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 58
}
```

## Endpoints

### `POST /api/chat`
Sends a message and waits for the full response.

**Request Payload**:
```json
{
  "message": "What is a good 3-day itinerary for Bali?"
}
```

### `POST /api/chat/stream`
Sends a message and returns a streamed response (Server-Sent Events) for real-time typing effects.

**Request Payload**:
```json
{
  "message": "Suggest some activities in Jakarta."
}
```
