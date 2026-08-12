# API Reference

## Authentication

Protected routes require a Sanctum Bearer token.

## Rate Limiting

The Chatbot endpoints (`/api/chat` and `/api/chat/stream`) are limited to 10 messages per minute to prevent abuse. Rate limit headers are included in responses.

## Pagination

List endpoints return paginated results.

## Full OpenAPI Spec

See `openapi.yml` for complete route details, schemas, and error responses.
