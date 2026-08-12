# How to Integrate the AI Chatbot

This guide explains how to integrate the Serute AI Assistant chatbot into your application.

## Prerequisites

- You must have a Chutes API token configured in your `.env` file (`CHUTES_API_TOKEN`).

## Integration Steps

The chatbot provides two endpoints: a standard JSON response (`/api/chat`) and a streaming response (`/api/chat/stream`).

### Step 1: Standard Chat Integration

For simple request-response interactions, use the `/api/chat` endpoint.

```javascript
async function sendMessage(text) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        // Optional: Include history for context
        conversation_history: [
          { sender: 'user', text: 'Hi' },
          { sender: 'assistant', text: 'Hello! How can I help you today?' }
        ]
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('Chatbot says:', data.message);
    } else {
      console.error('Error:', data.message);
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.warn(`Please wait ${data.retry_after} seconds before trying again.`);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Step 2: Streaming Chat Integration

For a more interactive experience where the response types out character by character, use the `/api/chat/stream` endpoint.

> **Note:** The streaming endpoint returns standard Server-Sent Events (SSE).

```javascript
async function streamMessage(text) {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      // The chunk might contain multiple data events or raw text depending on the Chutes API format
      console.log('Received chunk:', chunk);

      // Update your UI with the new chunk
      // document.getElementById('chat-box').innerHTML += chunk;
    }
  } catch (error) {
    console.error('Streaming error:', error);
  }
}
```

## Handling Rate Limits

The chatbot is strictly rate-limited to 10 requests per minute per user/IP. Your frontend must gracefully handle `429 Too Many Attempts` responses.

```javascript
function handleRateLimit(retryAfterSeconds) {
  const submitButton = document.getElementById('send-button');
  const warningText = document.getElementById('rate-limit-warning');

  submitButton.disabled = true;

  let timeLeft = retryAfterSeconds;

  const timer = setInterval(() => {
    timeLeft--;
    warningText.innerText = `Please wait ${timeLeft} seconds...`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitButton.disabled = false;
      warningText.innerText = '';
    }
  }, 1000);
}
```
