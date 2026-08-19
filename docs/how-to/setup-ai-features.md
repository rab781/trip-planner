# How-To: Set Up AI Features

This guide explains how to enable and configure the AI-powered features of the Itinerary Management System, including the intelligent chatbot and the automated itinerary generation engine.

## Step 1: Obtain a Chutes API Token

The AI features require a valid Chutes API token to function.

1. Create an account or log in to the Chutes AI platform.
2. Navigate to your API Keys or Developer Settings dashboard.
3. Generate a new API token and copy it.

## Step 2: Configure Your Environment

You need to provide the Chutes API token to your local or production environment.

1. Open your `.env` file located in the root directory.
2. Locate the `CHUTES_API_TOKEN` variable. If it doesn't exist, add it.
3. Paste your token:

```env
CHUTES_API_TOKEN=your_actual_chutes_token_here
```

## Step 3: Verify the Setup

To verify that the AI features are working correctly, you can test the chatbot endpoint.

1. Ensure your local server is running (`php artisan serve`).
2. Send a POST request to the chatbot endpoint:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"message": "Hello!"}'
```

If configured correctly, you should receive a `200 OK` response with an AI-generated reply.

> **Note**: The AI endpoints are rate-limited to prevent excessive costs. The chatbot is limited to 10 messages per minute, and the itinerary generation endpoints are limited to 5 requests per minute.
