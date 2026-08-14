# Chatbot API Reference

The Chatbot API allows users to interact with the AI assistant for travel recommendations. The chatbot is rate-limited to prevent abuse.

## Authentication

The Chatbot endpoints are public but are rate-limited per user/IP.

## Rate Limiting

Requests are limited to 10 messages per minute. If you exceed this limit, the API will return a `429 Too Many Attempts` response with a custom payload containing a `retry_after` field, instead of a standard `Retry-After` HTTP header.

## Endpoints

### Send a Message

`POST /api/chat`

Send a message to the AI chatbot and receive a response.

**Request Payload:**

```json
{
  "message": "Wisata di Bandung?",
  "conversation_history": [
    {
      "sender": "user",
      "text": "Halo!"
    },
    {
      "sender": "assistant",
      "text": "Halo! Ada yang bisa saya bantu?"
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Top 5 destinasi Bandung:\n\n1. Tangkuban Perahu (Rp50K, 08:00-17:00) - kawah vulkanik\n2. Dusun Bambu (Rp25K, 09:00-21:00) - wisata keluarga\n3. Farmhouse Lembang (Rp30K) - spot foto Eropa\n4. Floating Market (Rp20K) - kuliner + pasar apung\n5. Tebing Keraton (Gratis) - sunrise terbaik\n\nTips: Weekday lebih sepi, bawa jaket (dingin). Mau itinerary lengkap? Login di Serute! 🗺️",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 80,
    "total_tokens": 230
  }
}
```

**Response (429 Rate Limit Exceeded):**

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 60 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 60
}
```

### Stream a Message

`POST /api/chat/stream`

Send a message to the AI chatbot and receive a streamed response.

**Request Payload:**

```json
{
  "message": "Wisata di Bandung?",
  "conversation_history": []
}
```

**Response (200 OK):**

Streamed `text/event-stream` response.

**Response (429 Rate Limit Exceeded):**

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 60 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 60
}
```
