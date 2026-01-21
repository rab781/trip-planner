<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\ZoneController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\TransportRateController;
use App\Http\Controllers\ChatController;

// public API routes

Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{id}', [CityController::class, 'show']);
Route::get('/cities/{id}/zones', [ItineraryController::class, 'zones']);

Route::get('/zones',[ZoneController::class, 'index']);
Route::get('/zones/{id}', [ZoneController::class, 'show']);
Route::get('/zones/{id}/destination', [TransportRateController::class, 'destination']);

Route::get('/categories',[CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);

Route::get('/transport-rates', [TransportRateController::class, 'index']);

// Chatbot AI routes - public access with rate limiting
Route::middleware(['chatbot.rate'])->group(function () {
    Route::post('/chat', [ChatController::class, 'sendMessage']);
    Route::post('/chat/stream', [ChatController::class, 'sendMessageStream']);
});

// Protected API routes - require authentication

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/itineraries', [ItineraryController::class, 'index']);
    Route::post('/itineraries', [ItineraryController::class, 'store']);
    Route::get('/itineraries/{id}', [ItineraryController::class, 'show']);
    Route::put('/itineraries/{id}', [ItineraryController::class, 'update']);
    Route::delete('/itineraries/{id}', [ItineraryController::class, 'destroy']);

    Route::put('/itineraries/{id}/reorder', [ItineraryController::class, 'reorder']);
});

// ========================================
// ADMIN API (Protected)
// ========================================

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard stats
    Route::get('/stats', [DashboardController::class, 'stats']);

    // Manage Destinations
    Route::apiResource('destinations', AdminDestinationController::class);

    // Manage Users
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);

    // Manage Categories/Zones
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('zones', AdminZoneController::class);
});
