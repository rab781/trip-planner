# Chatbot API Reference

The Chatbot API allows users to interact with an AI assistant to get travel recommendations and itinerary suggestions. The API is publicly accessible but includes strict rate limiting to prevent abuse.

## Authentication
This endpoint does **not** require authentication. It can be accessed publicly.

## Rate Limiting
Requests to the chatbot endpoints are limited to **10 requests per minute** per user or IP address.

When the rate limit is exceeded, the server returns an HTTP `429 Too Many Requests` status code with the following custom JSON payload:

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 60 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 60
}
```

*Note: The `retry_after` field indicates the number of seconds until the rate limit resets.*

## Endpoints

### `POST /api/chat`
Send a message to the AI chatbot and receive a full response.

**Request Body**
```json
{
  "message": "What is a good 3-day itinerary for Bali?"
}
```

**Response (200 OK)**
```json
{
  "response": "Bali is great! I suggest you visit Ubud, Kuta, and Seminyak."
}
```

### `POST /api/chat/stream`
Send a message to the AI chatbot and receive a streamed response using Server-Sent Events (SSE).

**Request Body**
```json
{
  "message": "Suggest some activities in Jakarta."
}
```

**Response (200 OK - text/event-stream)**
```
data: {"response": "You "}
data: {"response": "can "}
data: {"response": "visit "}
...
```
