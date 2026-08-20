# Explanation: AI System Architecture

This document explains the reasoning behind the design of the AI Chatbot and Itinerary generation systems.

## The Chatbot System

The `/api/chat` endpoints act as a proxy and formatter for the underlying AI model hosted on Chutes AI.

### Model Selection
We use `Qwen/Qwen3-32B`. It provides an excellent balance of speed and instruction-following capability in Indonesian, which is critical for the "Serute AI Assistant" persona.

### Prompt Engineering
The system prompt (defined in `ChatController.php`) strictly enforces formatting constraints. We explicitly forbid XML tags (like `<think>`) to ensure the raw output is clean. Furthermore, a custom `cleanAiResponse` regex pipeline runs on standard responses to strip any remaining formatting artifacts before they reach the client.

### Rate Limiting Strategy
Resource-intensive AI endpoints are vulnerable to abuse and "Denial of Wallet" attacks.
The custom `ChatbotRateLimit` middleware restricts usage to 10 requests per minute. Crucially, it identifies users via Sanctum ID if logged in, falling back to IP address if unauthenticated. This allows guest users to try the feature while preventing single-IP abuse from registered users.

The `429` error response format intentionally provides `retry_after` in the JSON body, as frontend Javascript implementations often struggle to reliably read HTTP headers during CORS preflight failures or opaque responses.
