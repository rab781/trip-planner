# Chatbot API Reference

The Chatbot API allows you to interact with the AI assistant for travel recommendations. It provides both standard REST and streaming responses.

## Authentication
Publicly accessible, but rate limited per IP or user session.

## Rate Limiting
Requests are limited to 10 messages per minute per user/IP. The API returns a custom `429 Too Many Requests` JSON response instead of standard headers.

## Endpoints

### Send a Message
**`POST /api/chat`**

Sends a message to the AI chatbot and receives a complete JSON response.

**Request Body**
```json
{
  "message": "What is a good 3-day itinerary for Bali?"
}
```

**Example Request**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"message": "What is a good 3-day itinerary for Bali?"}'
```

**Responses**
- `200 OK`: Successful response.
  ```json
  {
    "success": true,
    "message": "Bali is great! I suggest you visit Ubud, Kuta, and Seminyak.",
    "usage": { "prompt_tokens": 50, "completion_tokens": 100, "total_tokens": 150 }
  }
  ```
- `429 Too Many Requests`: Rate limit exceeded.
  ```json
  {
    "success": false,
    "message": "Terlalu banyak pesan. Silakan tunggu 60 detik sebelum mengirim pesan lagi. ⏳",
    "retry_after": 60
  }
  ```

### Send a Streaming Message
**`POST /api/chat/stream`**

Sends a message and receives a Server-Sent Events (SSE) stream for a typing-effect UI.

**Request Body**
```json
{
  "message": "Suggest some activities in Jakarta.",
  "conversation_history": [
    { "sender": "user", "text": "Hi" },
    { "sender": "assistant", "text": "Halo!" }
  ]
}
```

**Example Request**
```bash
curl -N -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Suggest some activities in Jakarta."}'
```

**Responses**
- `200 OK`: Streamed response (`text/event-stream`).
- `429 Too Many Requests`: Rate limit exceeded (same format as `/api/chat`).
