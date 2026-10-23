# Tutorial: Set Up Itinerary Management System in 15 Minutes

**What you'll build**: A running local instance of the AI-powered Itinerary Management System with both backend API and frontend interfaces functional.

**What you'll learn**:
- Local environment configuration
- Running migrations
- Generating an itinerary with the API

**Prerequisites**:
- [ ] PHP 8.3+ installed
- [ ] Node.js (with `pnpm`) installed
- [ ] Composer installed
- [ ] A Chutes API token

---

## Step 1: Set Up Your Project

First, clone the project repository and install the backend PHP dependencies.

```bash
git clone https://github.com/rab781/trip-planner.git
cd trip-planner
composer install
```

> **Tip**: If you see dependency errors, ensure you are running PHP 8.3+.

## Step 2: Configure Environment

Copy the example environment file and generate a Laravel application key.

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and add your Chutes API token:
```env
CHUTES_API_TOKEN=your_token_here
```

## Step 3: Prepare the Database

Run the database migrations. SQLite is used by default.

```bash
touch database/database.sqlite
php artisan migrate --force
```

## Step 4: Install Frontend Assets

Use `pnpm` to install node modules and build frontend assets.

```bash
pnpm install
pnpm run build
```

## Step 5: Start Servers

Start the local development servers for Laravel and Vite.

```bash
php artisan serve > /dev/null 2>&1 &
pnpm run dev > /dev/null 2>&1 &
```

## Step 6: What You Built

You successfully built and deployed a local development instance of the Itinerary Management System. You learned how to setup the environment, compile frontend assets, and start the servers.

## Next Steps

- [How-To: Generate an Itinerary](../how-to/generate-itinerary.md)
- [Reference: API Details](../reference/api-reference.md)
