# Chatbot API

Interact with the Serute AI Assistant to get recommendations for destinations, transportation, and more.

## Authentication
This API can be accessed without authentication, but rate limiting applies based on IP. If authenticated via Sanctum Bearer token, rate limiting is applied per user.

## Endpoints

### Send a Message

`POST /api/chat`

**Description:**
Send a message to the AI chatbot and receive a response.

**Request Body:**

```json
{
  "message": "What is a good 3-day itinerary for Bali?",
  "conversation_history": [
    {
      "sender": "user",
      "text": "Hi"
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | The message to send to the chatbot. Max 1000 characters. |
| `conversation_history` | array | No | The previous messages in the conversation to maintain context. Max 10. |

**Responses:**

*   **200 OK**

    ```json
    {
      "success": true,
      "message": "Bali is great! I suggest you visit Ubud, Kuta, and Seminyak.",
      "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 20,
        "total_tokens": 30
      }
    }
    ```

*   **429 Too Many Requests**

    Rate limiting: 10 messages per minute.

    ```json
    {
      "success": false,
      "message": "Terlalu banyak pesan. Silakan tunggu 30 detik sebelum mengirim pesan lagi. ⏳",
      "retry_after": 30
    }
    ```
