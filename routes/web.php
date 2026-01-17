<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;
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
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

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
    Route::resource('destinations', AdminDestinationController::class);

    // Manage Users
    Route::get('/users', [UserController::class, 'index'])
        ->name('admin.users.index');
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
