<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\ZoneController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\TransportRateController;
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

// Protected API routes - require authentication

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/itineraries', [ItineraryController::class, 'index']);
    Route::post('/itineraries', [ItineraryController::class, 'store']);
    Route::get('/itineraries/{id}', [ItineraryController::class, 'show']);
    Route::put('/itineraries/{id}', [ItineraryController::class, 'update']);
    Route::delete('/itineraries/{id}', [ItineraryController::class, 'destroy']);

    Route::put('/iternary/(id)/reorder',[ItineraryController::class, 'reorder']);
});