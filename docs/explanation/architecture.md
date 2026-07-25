# Explanation: System Architecture

This document explains the technical design decisions behind the Trip Planner application.

## The Problem

Planning travel often requires coordinating multiple disjointed data sources: maps for proximity, spreadsheets for budgets, and blogs for recommendations.

## The Solution

The Trip Planner centralizes this by acting as a smart orchestrator:
1. **Data Layer**: Stores cities, zones, and destinations in a lightweight SQLite database (easily swappable to PostgreSQL or MySQL).
2. **Sorting Algorithm**: Groups selected destinations by predefined geographic zones to minimize travel time between points of interest.
3. **AI Integration**: Uses Chutes AI to intelligently sequence destinations within a day, ensuring logical flow (e.g., breakfast before sightseeing).
4. **Presentation**: A React frontend powered by Inertia.js consumes the generated plan.

## Why SQLite?

SQLite is used for ease of setup in local development and testing, removing the friction of configuring separate database containers for initial onboarding.

## Rate Limiting and Security

AI generation is computationally expensive. We implement Laravel's native rate limiting (`throttle:5,1`) on these endpoints to prevent Denial of Wallet (DoW) attacks and ensure stable service for all users.
