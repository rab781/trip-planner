# How-To: Implement Streaming Chat Responses

This guide explains how to consume the `/api/chat/stream` endpoint to display AI responses as they are being generated, similar to ChatGPT's typing effect.

## Step 1: Use the Fetch API for Streams

Instead of waiting for the full response, you process the `ReadableStream` provided by the Fetch API.

```javascript
async function startStreamingChat(userMessage) {
  const outputContainer = document.getElementById('chat-output');
  outputContainer.textContent = ''; // Clear previous text

  try {
    const response = await fetch('http://localhost:8000/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        console.error(`Rate limited! Wait ${errorData.retry_after}s`);
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      outputContainer.textContent += chunk; // Append chunk directly

      // Optional: Auto-scroll to bottom
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    console.log('Stream finished.');
  } catch (error) {
    console.error("Streaming error:", error);
  }
}
```

## Step 2: Handle Stream Interruptions

Streaming connections can drop. Ensure your UI can handle incomplete responses gracefully. The `fetch` API will throw an error if the connection is prematurely closed, which is caught in the `catch` block above.

## Key Considerations

- The API returns plain text chunks directly, not Server-Sent Events (SSE) format like `data: { ... }\n\n`.
- Rate limiting (`429`) is evaluated *before* the stream begins, so it returns a standard JSON error response, not a streamed error.
