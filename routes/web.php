<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ItineraryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ZoneController as AdminZoneController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// PUBLIC ROUTES
// ========================================

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('home');

// ========================================
// USER ROUTES (Authenticated)
// ========================================

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Itinerary Routes
    Route::get('/itineraries', [ItineraryController::class, 'index'])->name('itineraries.index');
    Route::get('/itineraries/create', [ItineraryController::class, 'create'])->name('itineraries.create');
    Route::get('/itineraries/{id}', [ItineraryController::class, 'show'])->name('itineraries.show');
    Route::get('/itineraries/{id}/edit', [ItineraryController::class, 'edit'])->name('itineraries.edit');
});

// ========================================
// ADMIN LOGIN (Public - No Middleware!)
// ========================================

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])
        ->name('admin.login')
        ->middleware('guest');  // ✅ Redirect kalau sudah login

    Route::post('/login', [AdminAuthController::class, 'login'])
        ->name('admin.login.post');

    Route::post('/logout', [AdminAuthController::class, 'logout'])
        ->name('admin.logout')
        ->middleware('auth');
});

// ========================================
// ADMIN ROUTES (Protected)
// ========================================

Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Manage Destinations (CRUD)
    Route::resource('destinations', AdminDestinationController::class)
        ->names([
            'index' => 'admin.destinations.index',
            'create' => 'admin.destinations.create',
            'store' => 'admin.destinations.store',
            'show' => 'admin.destinations.show',
            'edit' => 'admin.destinations.edit',
            'update' => 'admin.destinations.update',
            'destroy' => 'admin.destinations.destroy',
        ]);

    // Manage Categories (CRUD)
    Route::resource('categories', AdminCategoryController::class)
        ->names([
            'index' => 'admin.categories.index',
            'create' => 'admin.categories.create',
            'store' => 'admin.categories.store',
            'show' => 'admin.categories.show',
            'edit' => 'admin.categories.edit',
            'update' => 'admin.categories.update',
            'destroy' => 'admin.categories.destroy',
        ]);

    // Manage Zones (CRUD)
    Route::resource('zones', AdminZoneController::class)
        ->names([
            'index' => 'admin.zones.index',
            'create' => 'admin.zones.create',
            'store' => 'admin.zones.store',
            'show' => 'admin.zones.show',
            'edit' => 'admin.zones.edit',
            'update' => 'admin.zones.update',
            'destroy' => 'admin.zones.destroy',
        ]);

    // Manage Users
    Route::get('/users', [UserController::class, 'index'])
        ->name('admin.users.index');
    Route::get('/users/{id}', [UserController::class, 'show'])
        ->name('admin.users.show');
    Route::patch('/users/{id}/toggle-role', [UserController::class, 'toggleRole'])
        ->name('admin.users.toggle-role');

    // Reports
    Route::get('/reports', [DashboardController::class, 'reports'])
        ->name('admin.reports');
});

// ========================================
// AUTH ROUTES (Laravel Breeze)
// ========================================

require __DIR__.'/auth.php';
