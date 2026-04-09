# Itinerary Management System

> An intelligent, AI-powered travel planning platform that generates optimized itineraries, calculates budgets, and estimates transport costs.

[![PHP Version](https://img.shields.io/badge/PHP-8.3-blue.svg)](https://php.net)
[![Laravel Version](https://img.shields.io/badge/Laravel-12.0-red.svg)](https://laravel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

Planning a multi-destination trip often involves countless tabs, manual distance calculations, and frustrating spreadsheet budget estimates. This system solves that pain by automatically sorting destinations by proximity to minimize travel time, generating realistic budget breakdowns, and offering AI-driven route suggestions—so you spend less time planning and more time traveling.

## Quick Start

You can start the application locally in under five minutes.

```bash
git clone https://github.com/yourname/itinerary-management-system.git
cd itinerary-management-system
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
pnpm install
pnpm run build
php artisan serve > /dev/null 2>&1 &
pnpm run dev > /dev/null 2>&1 &
```

```javascript
// Example: Fetch all cities from the API
const response = await fetch('http://localhost:8000/api/cities', {
    headers: {
        'Accept': 'application/json',
    }
});
const cities = await response.json();
console.log(cities);
```

## Installation

**Prerequisites**: PHP 8.3+, Composer 2.9.5+, Node.js (with `pnpm`), and SQLite.

1. **Clone the project** to your local machine.
   ```bash
   git clone https://github.com/yourname/itinerary-management-system.git
   cd itinerary-management-system
   ```

2. **Install backend dependencies** using Composer.
   ```bash
   composer install
   ```

3. **Configure your environment**.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure Chutes AI**.
   Open your `.env` file and add your Chutes API token to enable the AI chatbot functionality:
   ```env
   CHUTES_API_TOKEN=your_actual_token_here
   ```

5. **Set up the database**.
   By default, the application uses SQLite. You must ensure `database/database.sqlite` exists and then run migrations:
   ```bash
   touch database/database.sqlite
   php artisan migrate --force
   ```

6. **Install frontend dependencies**.
   This project strictly uses `pnpm` for frontend package management. You must use `pnpm` rather than `npm` or `yarn`.
   ```bash
   pnpm install
   pnpm run build
   ```

## Usage

### Basic Example

The system provides a robust JSON API for managing itineraries. Once you authenticate via Laravel Sanctum, you interact with the endpoints using a Bearer token. Here is how you can retrieve all destinations for a specific zone without needing authentication.

```bash
curl -X GET http://localhost:8000/api/zones/1/destination \
  -H "Accept: application/json"
```

### Configuration

Key environment variables in your `.env` file govern system behavior:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DB_CONNECTION` | `string` | `sqlite` | The database connection driver |
| `CHUTES_API_TOKEN` | `string` | `null` | Required token for AI chatbot and itinerary generation features |
| `VITE_APP_NAME` | `string` | `Laravel` | The application name exposed to the Vite frontend |

### Advanced Usage

You generate optimized daily itineraries by passing destination IDs to the AI generator endpoint. The system automatically groups destinations by zone, sorts them using a nearest-neighbor algorithm, and calculates estimated transport costs based on the pax count.

```bash
curl -X POST http://localhost:8000/api/itineraries/generate \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city_id": 1,
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "categories": ["sightseeing", "food", "nightlife"],
    "destination_ids": [1, 4, 7, 12],
    "total_pax_count": 2
  }'
```

> **Note**: You must explicitly enforce SSL verification for cURL requests in production environments to prevent MITM attacks.

## API Reference

See [full API reference in openapi.yml](./openapi.yml)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Your Name](https://github.com/yourname)
