# Chatbot API Reference

The Chatbot API allows users to interact with the AI assistant to get travel recommendations and generate responses for itinerary planning.

## Authentication
Chatbot endpoints do not strictly require authentication, but if a Sanctum Bearer token is provided in the `Authorization` header, the rate limit is tied to the authenticated user ID rather than the IP address.

## Rate Limiting
To prevent abuse, the chatbot endpoints use a custom rate limiter. Users (identified by ID if authenticated, or by IP address) are limited to **10 messages per minute**.

When the rate limit is exceeded, the API returns a `429 Too Many Requests` status code with a custom JSON response payload, rather than standard HTTP `Retry-After` headers.

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 60 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 60
}
```

---

## Endpoints

### 1. Interact with the AI Chatbot
Send a message to the AI chatbot and receive a standard, fully formed JSON response.

**Endpoint:** `POST /api/chat`

**Request Body (JSON):**
| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `message` | `string` | Yes      | The message to send to the chatbot. |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"message": "What is a good 3-day itinerary for Bali?"}'
```

**Responses:**

- `200 OK`: Successful response.
  ```json
  {
    "response": "Bali is great! I suggest you visit Ubud, Kuta, and Seminyak."
  }
  ```
- `429 Too Many Requests`: Rate limit exceeded.

---

### 2. Stream AI Chatbot Response
Send a message to the AI chatbot and receive the response as a Server-Sent Events (SSE) stream. This is useful for providing real-time feedback to the user while the AI generates a long response.

**Endpoint:** `POST /api/chat/stream`

**Request Body (JSON):**
| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `message` | `string` | Yes      | The message to send to the chatbot. |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"message": "Suggest some activities in Jakarta."}'
```

**Responses:**

- `200 OK`: Streamed response. The content type will be `text/event-stream`.
- `429 Too Many Requests`: Rate limit exceeded.
