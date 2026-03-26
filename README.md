# Itinerary Management System

> An intelligent, AI-powered travel planning platform that generates optimized itineraries, calculates budgets, and estimates transport costs.

[![PHP Version](https://img.shields.io/badge/PHP-8.3-blue.svg)](https://php.net)
[![Laravel Version](https://img.shields.io/badge/Laravel-12.0-red.svg)](https://laravel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

Planning a multi-destination trip requires endless tabs, manual calculations, and frustrating spreadsheet estimates. This platform solves that pain by automatically grouping destinations, calculating transport costs, and generating optimized daily itineraries. You spend less time planning and more time traveling.

## Quick Start

```bash
git clone <repository-url> itinerary-system && cd itinerary-system
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate --force
pnpm install && pnpm run build
php artisan serve > /dev/null 2>&1 &
pnpm run dev > /dev/null 2>&1 &
```

```javascript
// Example: Fetch all cities using the public API
const response = await fetch('http://localhost:8000/api/cities', {
    headers: { 'Accept': 'application/json' }
});
const cities = await response.json();
console.log(cities); // [{ id: 1, name: "Tokyo" }, ...]
```

## Installation

**Prerequisites**: PHP 8.3+, Composer 2.9.5+, Node.js (with `pnpm`), and SQLite.

1. **Clone the repository**
   ```bash
   git clone <repository-url> itinerary-system
   cd itinerary-system
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Configure your environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Enable AI Features**
   Open `.env` and add your Chutes API token:
   ```env
   CHUTES_API_TOKEN=your_chutes_api_token
   ```

5. **Set up the database**
   Initialize the SQLite database and run migrations:
   ```bash
   touch database/database.sqlite
   php artisan migrate --force
   ```

6. **Install frontend dependencies**
   Use `pnpm` to install and build frontend assets:
   ```bash
   pnpm install
   pnpm run build
   ```

## Usage

### Basic Example

Interact with the API using Bearer token authentication provided by Laravel Sanctum.

```javascript
// Fetch your itineraries
const response = await fetch('http://localhost:8000/api/itineraries', {
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_SANCTUM_TOKEN'
    }
});
const itineraries = await response.json();
console.log(itineraries);
```

### Configuration

Customize the application through the `.env` file.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DB_CONNECTION` | `string` | `sqlite` | The database connection driver |
| `CHUTES_API_TOKEN` | `string` | `null` | Required token for AI chatbot and itinerary generation |
| `VITE_APP_NAME` | `string` | `Laravel` | The application name exposed to the Vite frontend |

### Advanced Usage

You generate optimized daily itineraries by passing destination IDs to the AI generator endpoint. The system automatically groups destinations by zone, sorts them using a nearest-neighbor algorithm, and calculates estimated transport costs.

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

> **Note**: The system requires explicit SSL verification for cURL requests in production environments.

## API Reference

The application exposes RESTful endpoints. Public endpoints require no authentication, while protected endpoints require a Sanctum Bearer token. See `routes/api.php` for the complete endpoint list.

### Public Endpoints
- `GET /api/cities` - List all cities
- `GET /api/zones` - List all zones
- `GET /api/destinations` - List available destinations
- `GET /api/transport-rates` - View transport cost rates
- `POST /api/chat` - Interact with the AI Chatbot (rate limited)

### Protected Endpoints
- `GET /api/itineraries` - List your itineraries
- `POST /api/itineraries` - Create a new itinerary manually
- `POST /api/itineraries/generate` - AI-generate an optimized itinerary
- `PUT /api/itineraries/{id}/reorder` - Manually adjust the sequence of destinations

## Contributing

Review our coding standards before contributing:
- Always run `php artisan test` and verify the frontend builds successfully (`pnpm run build`) before creating a PR.
- Add comments explaining any performance optimizations.
- Ensure all new API routes have corresponding documentation updates.

## License

MIT © Itinerary Management System
