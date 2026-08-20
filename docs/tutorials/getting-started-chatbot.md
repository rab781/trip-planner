# Tutorial: Integrating the AI Chatbot in 10 Minutes

**What you'll build**: A simple interactive AI chatbot client that communicates with the Serute AI Assistant to get travel recommendations.

**What you'll learn**:
- How to authenticate requests.
- How to pass conversation history.
- How to handle custom rate limits.

**Prerequisites**:
- [ ] Local environment running on `http://localhost:8000`
- [ ] Chutes API Token configured in `.env` (`CHUTES_API_TOKEN`)

---

## Step 1: Prepare the Request Structure

First, define the request payload. You'll need the user's `message` and an optional `conversation_history` to maintain context.

```javascript
const requestBody = {
  message: "Saran kuliner di Ubud?",
  conversation_history: [
    { sender: "user", text: "Halo, saya sedang di Bali." },
    { sender: "admin", text: "Halo! Selamat datang di Bali. Ada yang bisa saya bantu terkait rencana wisata Anda?" }
  ]
};
```

## Step 2: Make the API Call

We'll use standard `fetch` to send a request to the standard (non-streaming) `/api/chat` endpoint. Since it's a public endpoint, you don't *need* a Bearer token, but providing one ensures rate limits are tied to the user account rather than just the IP address.

```javascript
async function sendChatMessage() {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': 'Bearer YOUR_SANCTUM_TOKEN' // Optional
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("AI says:", data.message);
    } else if (response.status === 429) {
      // Handle the custom rate limit structure
      console.error(`Rate limited! Try again in ${data.retry_after} seconds.`);
      console.error("Message:", data.message);
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

sendChatMessage();
```

## Step 3: Handle the Custom Rate Limit Format

Notice in Step 2 that when a 429 status is returned, we read `data.retry_after` directly from the JSON body instead of the HTTP `Retry-After` header. This is a specific behavior of the `chatbot.rate` middleware.

```json
{
  "success": false,
  "message": "Terlalu banyak pesan. Silakan tunggu 45 detik sebelum mengirim pesan lagi. ⏳",
  "retry_after": 45
}
```

## What You Built

You built a robust integration with the Chatbot API. Here's what you learned:
- **Conversation Context**: How to pass `conversation_history` to maintain AI memory.
- **Rate Limit Handling**: The insight that rate limit info is available in the JSON payload, not just headers.

## Next Steps

- [Reference: Chatbot API Reference](../reference/api-chatbot.md)
