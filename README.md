# Smart Itinerary Planner

> An AI-powered travel itinerary generator and management system that creates optimized, personalized travel plans with intelligent drag-and-drop sequencing.

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20.svg?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9.svg?style=flat)](https://inertiajs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

Planning a multi-day trip involves juggling transportation schedules, attraction locations, opening hours, and budgets—often resulting in a messy spreadsheet and decision fatigue. The Smart Itinerary Planner solves this by using AI to instantly generate logical, distance-optimized travel days, while giving you a seamless drag-and-drop interface to easily customize the results. It bridges the gap between automated suggestions and manual control.

## Quick Start

The fastest way to get the planner running locally:

```bash
# Clone the repository
git clone <repository-url>
cd smart-itinerary-planner

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database (SQLite by default)
touch database/database.sqlite
php artisan migrate:fresh --seed

# Start the development servers
npm run dev &
php artisan serve
```

Open `http://localhost:8000` in your browser. Default users are created by the seeder.

## Installation

**Prerequisites**:
- PHP 8.2+
- Node.js 18+ and npm 9+
- Composer 2.0+

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-itinerary-planner
   ```

2. **Install PHP and Node dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

   *Optional but recommended: Configure your Chutes AI API Token in `.env` to enable AI itinerary generation:*
   ```env
   CHUTES_API_TOKEN=your_chutes_api_token_here
   ```

4. **Initialize Database**
   We use SQLite by default for easy setup.
   ```bash
   touch database/database.sqlite
   php artisan migrate:fresh --seed
   ```

5. **Build Assets and Run Server**
   ```bash
   npm run build
   php artisan serve
   ```

## Usage

### Basic Example: Generating an Itinerary

1. Log in to the application at `http://localhost:8000`.
2. Navigate to "Itineraries" and click "Create New".
3. Fill in the destination city, travel dates, and click "Generate with AI".
4. The system will build a day-by-day plan automatically.

### Modifying an Itinerary (Drag & Drop)

You can manually adjust your schedule on the Itinerary Details page:
- **Reorder**: Click and drag any item within a day to change the sequence. Distances and travel times will recalculate automatically.
- **Move across days**: Drag an item from Day 1 to Day 2 to shift the schedule.
- **Add details**: Click any destination to view more info, including estimated costs and recommended duration.

### Interacting with the AI Chatbot

Click the chat bubble in the bottom right corner to ask questions about your destination, seek recommendations, or request alternative activities if a place is closed.

## Core Features

- **AI Itinerary Generation**: Uses LLMs to create realistic, sequenced travel plans based on user preferences.
- **Drag-and-Drop Editor**: Powered by `@hello-pangea/dnd`, allowing fluid reordering of activities with real-time distance recalculation.
- **Budget Tracking**: Automatic calculation of transportation, lodging, and activity costs.
- **Interactive Maps**: Integrated with Leaflet to visualize daily routes and optimize travel paths.
- **Role-Based Admin Panel**: Manage destinations, zones, transport rates, and users from a secure dashboard.

## API Reference

The application exposes a REST API for core functionalities. All endpoints (except public ones like `/api/cities`) require Sanctum authentication.

See the `routes/api.php` file for a full list of endpoints.

**Example: Fetching Itineraries**
```http
GET /api/itineraries
Authorization: Bearer <your-token>
Accept: application/json
```

**Example Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Weekend in Paris",
      "city_id": 4,
      "start_date": "2026-05-10",
      "end_date": "2026-05-12",
      "total_budget": 850.50
    }
  ]
}
```

## Architecture

This project uses a **Laravel + React + Inertia + Tailwind** stack:
- **Framework**: Laravel 12
- **Frontend**: React 18 with Inertia.js (No separate API needed for web views)
- **Styling**: Tailwind CSS
- **Database**: SQLite (Configurable to MySQL/PostgreSQL)
- **AI Integration**: Chutes API

## Contributing

We welcome contributions! Please see our standard contribution guidelines.

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
