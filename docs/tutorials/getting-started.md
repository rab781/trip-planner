# Tutorial: Getting Started with the Trip Planner in 15 Minutes

**What you'll build**: A working local installation of the Trip Planner application, capable of generating an AI-powered travel itinerary.

**What you'll learn**:
- How to set up the local environment (PHP, Laravel, Node.js).
- How to generate your first itinerary using the API.

**Prerequisites**:
- [ ] PHP 8.3+ installed
- [ ] Composer 2.9.5+ installed
- [ ] Node.js and `pnpm` installed
- [ ] A Chutes API token (for AI features)

---

## Step 1: Set Up Your Environment

First, let's clone the repository and install the backend and frontend dependencies.

```bash
git clone https://github.com/rab781/trip-planner.git
cd trip-planner
composer install
pnpm install
```

## Step 2: Configure the Application

Next, set up your `.env` file and generate a Laravel application key.

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and add your Chutes API token:
```env
CHUTES_API_TOKEN=your_token_here
```

## Step 3: Prepare the Database

We'll use SQLite for simplicity. Create the database file and run the migrations.

```bash
touch database/database.sqlite
php artisan migrate --force
```

## Step 4: Start the Servers

Start both the backend API server and the frontend Vite development server.

```bash
php artisan serve > /dev/null 2>&1 &
pnpm run dev > /dev/null 2>&1 &
```

## Step 5: What You Built

You successfully set up the Trip Planner! You learned:
- **Environment Setup**: How to bootstrap a Laravel/React app with SQLite.
- **Service Configuration**: How to integrate the Chutes AI token.

## Next Steps

- [How-To: Generate Custom Itineraries](../how-to/generate-itineraries.md)
- [Reference: Full API endpoints](../reference/api-reference.md)
