# Chatbot API Reference

The AI Chatbot API allows you to interact with Serute AI Assistant to get travel recommendations and information.

## Base URL

All requests are made to `/api`.

## Authentication

Chatbot endpoints are public and do not require authentication, but they are subject to rate limiting.

## Rate Limiting

Chatbot endpoints are limited to 10 requests per minute per IP address (or per authenticated user).

If you exceed the rate limit, you will receive a `429 Too Many Attempts` response with a `Retry-After` header indicating how many seconds to wait before trying again.

## Endpoints

### `POST /api/chat`

Send a message to the AI chatbot and receive a JSON response.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | Yes | The message to send to the chatbot |
| `conversation_history` | `array` | No | Previous messages in the conversation for context. Each item should be an object with `sender` ("user" or "assistant") and `text` properties. |

**Example Request:**
```json
{
  "message": "What is a good 3-day itinerary for Bali?"
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Bali is great! I suggest you visit Ubud, Kuta, and Seminyak.",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 50,
    "total_tokens": 200
  }
}
```

**Rate Limit Exceeded (429 Too Many Attempts):**
```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 45 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 45
}
```

**Error Responses:**
- `500 Internal Server Error`: Returned when the Chutes AI API is unreachable or returns an invalid response format.
- `400 Bad Request`: Returned when the request fails validation.

### `POST /api/chat/stream`

Send a message to the AI chatbot and receive a Server-Sent Events (SSE) streamed response.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | Yes | The message to send to the chatbot |
| `conversation_history` | `array` | No | Previous messages in the conversation for context. Each item should be an object with `sender` ("user" or "assistant") and `text` properties. |

**Example Request:**
```json
{
  "message": "Suggest some activities in Jakarta."
}
```

#### Response

**Success Response (200 OK):**
Returns a `text/event-stream` response with the generated text chunks.

**Rate Limit Exceeded (429 Too Many Attempts):**
```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 45 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 45
}
```
