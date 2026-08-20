# Chatbot API Reference

The Chatbot API allows you to interact directly with the Serute AI Assistant to receive optimized destination recommendations, travel tips, and transport information based on your queries.

## Authentication

The Chatbot API endpoints are accessible **without authentication**. However, rate limits will be applied based on the IP address. If the request is authenticated with a Sanctum Bearer token, the rate limits are applied to the user ID.

## Rate Limiting

The `/api/chat` and `/api/chat/stream` endpoints are protected by the `chatbot.rate` middleware. Users are restricted to **10 messages per minute**.

When the limit is exceeded, a `429 Too Many Requests` response is returned.

**Rate Limit Exceeded Response:**

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 30 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 30
}
```

*Note: Instead of the standard `Retry-After` HTTP header, the `retry_after` parameter is included directly in the JSON response payload.*

## Endpoints

### 1. Send Message (Standard)

`POST /api/chat`

Sends a message to the Serute AI Assistant and waits for the complete response.

#### Request Body

Content-Type: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | The text to send to the chatbot. Maximum of 1000 characters. |
| `conversation_history` | array | No | An array of previous messages to maintain context. Max 10 messages. |

**Example Request:**

```json
{
  "message": "Wisata di Bandung?",
  "conversation_history": [
    {
      "sender": "user",
      "text": "Halo!"
    },
    {
      "sender": "admin",
      "text": "Halo! Ada yang bisa Serute bantu?"
    }
  ]
}
```

#### Response

**200 OK**

```json
{
  "success": true,
  "message": "Top 5 destinasi Bandung:\n\n1. Tangkuban Perahu (Rp50K, 08:00-17:00) - kawah vulkanik\n2. Dusun Bambu (Rp25K, 09:00-21:00) - wisata keluarga\n3. Farmhouse Lembang (Rp30K) - spot foto Eropa\n4. Floating Market (Rp20K) - kuliner + pasar apung\n5. Tebing Keraton (Gratis) - sunrise terbaik\n\nTips: Weekday lebih sepi, bawa jaket (dingin). Mau itinerary lengkap? Login di Serute! 🗺️",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 85,
    "total_tokens": 235
  }
}
```

### 2. Send Message (Stream)

`POST /api/chat/stream`

Sends a message to the AI Assistant and receives the response as a continuous stream of events. Ideal for creating typing-indicator experiences in UI.

#### Request Body

Content-Type: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | The text to send to the chatbot. Maximum of 1000 characters. |
| `conversation_history` | array | No | An array of previous messages to maintain context. Max 10 messages. |

**Example Request:**

```json
{
  "message": "Saran kuliner di Ubud?"
}
```

#### Response

**200 OK**

Content-Type: `text/event-stream`

The endpoint returns chunks of the text response progressively.

```
...streamed text chunks...
```
