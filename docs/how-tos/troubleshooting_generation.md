# How-To: Troubleshoot Itinerary Generation Failures

Generating an itinerary involves several moving parts: database references, AI prompt generation, external API calls, and algorithmic sorting. When something goes wrong, diagnosing the issue requires understanding where in the pipeline the failure occurred.

This guide will show you how to identify and resolve the most common issues encountered when using the `/api/itineraries/generate` endpoint.

## 1. Missing or Invalid Chutes API Token

The AI relies on the `CHUTES_API_TOKEN` environment variable to authenticate with the remote model.

**Symptom:**
You receive a `500 Internal Server Error` with a message indicating an HTTP client exception or a timeout from the Chutes service.

**Solution:**
Ensure that your `.env` file contains a valid token:

```env
CHUTES_API_TOKEN=your_actual_token_here
```

After modifying the `.env` file, ensure you restart your local development server (`php artisan serve`) or clear the configuration cache (`php artisan config:clear`).

## 2. Invalid Payload Parameters

The API enforces strict validation rules to ensure the AI has enough context to generate a meaningful itinerary.

**Symptom:**
You receive a `422 Unprocessable Content` response.

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "start_date": [
      "The start date must be a valid date."
    ],
    "end_date": [
      "The end date must be a date after or equal to start date."
    ]
  }
}
```

**Solution:**
Review the `errors` object in the response. Common validation failures include:
- `end_date` is before `start_date`.
- `categories` array contains IDs that do not exist in the database.
- Missing required fields like `transportation_preference` (must be `MOTOR` or `CAR`), `priority`, or `pace`.

Refer to the [API Reference](../reference/api.md) for the exact payload requirements.

## 3. Rate Limiting (Denial of Wallet Protection)

Because AI generation is resource-intensive, the endpoints are aggressively rate-limited.

**Symptom:**
You receive a `429 Too Many Requests` response.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
    "message": "Too Many Attempts."
}
```

**Solution:**
Check the `Retry-After` header in the response, which indicates the number of seconds you must wait before making another request. The system uses Laravel's `throttle` middleware for these routes. If you are developing locally and need to bypass this frequently, consider adjusting the throttle limits in the route definitions temporarily, but **do not commit** those changes.

## 4. Insufficient Destination Data

The nearest-neighbor algorithm requires a critical mass of destinations in a city to formulate a multi-day plan.

**Symptom:**
The generation completes, but the response indicates empty days or fails to fill the entire requested duration.

**Solution:**
Ensure the `cities`, `zones`, and `destinations` tables in your database are properly seeded with enough variety to accommodate the requested `total_days` and `pace`. The AI cannot invent places that don't exist in your local database schema.
