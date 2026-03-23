# Itinerary Management System

> An intelligent, AI-powered travel planning platform that generates optimized itineraries, calculates budgets, and estimates transport costs.

[![PHP Version](https://img.shields.io/badge/PHP-8.3-blue.svg)](https://php.net)
[![Laravel Version](https://img.shields.io/badge/Laravel-12.0-red.svg)](https://laravel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

Planning a multi-destination trip often involves countless tabs, manual distance calculations, and frustrating spreadsheet budget estimates. This system solves that pain by automatically sorting destinations by proximity to minimize travel time, generating realistic budget breakdowns, and offering AI-driven route suggestions—so you spend less time planning and more time traveling.

## Quick Start

You can get the application running locally in under five minutes.

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install PHP dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Prepare the database
php artisan migrate --force

# Install frontend dependencies and build assets
pnpm install
pnpm run build

# Start the development servers
php artisan serve > /dev/null 2>&1 &
pnpm run dev > /dev/null 2>&1 &
```

## Installation

**Prerequisites**: PHP 8.3+, Composer 2.9.5+, Node.js (with `pnpm`), and SQLite.

1. **Clone the project** to your local machine.
2. **Install backend dependencies** using Composer:
   ```bash
   composer install
   ```
3. **Configure your environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. **Configure Chutes AI**:
   Open your `.env` file and add your Chutes API token to enable the AI chatbot functionality:
   ```env
   CHUTES_API_TOKEN=your_actual_token_here
   ```
5. **Set up the database**:
   By default, the application uses SQLite. Ensure `database/database.sqlite` exists or let Laravel create it during migration:
   ```bash
   touch database/database.sqlite
   php artisan migrate --force
   ```
6. **Install frontend dependencies**:
   This project strictly uses `pnpm` for frontend package management.
   ```bash
   pnpm install
   pnpm run build
   ```

## Usage

### Basic Example: Accessing the API

The system provides a robust JSON API for managing itineraries. Once authenticated via Laravel Sanctum, you interact with the endpoints using a Bearer token.

```javascript
// Example: Fetch all cities
const response = await fetch('http://localhost:8000/api/cities', {
    headers: {
        'Accept': 'application/json',
    }
});
const cities = await response.json();
console.log(cities);
```

### Configuration

Key environment variables in your `.env` file govern system behavior:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DB_CONNECTION` | `string` | `sqlite` | The database connection driver. |
| `CHUTES_API_TOKEN` | `string` | `null` | Required token for AI chatbot and itinerary generation features. |
| `VITE_APP_NAME` | `string` | `Laravel` | The application name exposed to the Vite frontend. |

### Advanced Usage: AI Itinerary Generation

You generate optimized daily itineraries by passing destination IDs to the AI generator endpoint. The system automatically groups destinations by zone, sorts them using a nearest-neighbor algorithm, and calculates estimated transport costs based on the pax count.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "destination_ids": [1, 4, 7, 12],
    "total_pax_count": 2,
    "total_days": 3
  }'
```
*Note: The system requires explicit SSL verification for cURL requests in production environments.*

## API Reference

The application exposes several RESTful endpoints. Public endpoints do not require authentication, while protected endpoints require a Sanctum Bearer token.

### Public Endpoints
- `GET /api/cities` - List all cities.
- `GET /api/zones` - List all zones.
- `GET /api/destinations` - List available destinations.
- `GET /api/transport-rates` - View transport cost rates.
- `POST /api/chat` - Interact with the AI Chatbot (rate limited).

### Protected Endpoints (Requires Auth)
- `GET /api/itineraries` - List your itineraries.
- `POST /api/itineraries` - Create a new itinerary manually.
- `POST /api/itineraries/generate` - AI-generate an optimized itinerary.
- `PUT /api/itineraries/{id}/reorder` - Manually adjust the sequence of destinations.

## Contributing

We welcome contributions! Please review our coding standards:
- Always run `php artisan test` and frontend linters before creating a PR.
- Add comments explaining any performance optimizations.
- Ensure all new API routes have corresponding documentation updates.

## License

This project is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) details.
