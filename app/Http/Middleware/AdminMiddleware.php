<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle(Request $request, Closure $next): Response
    {
        // User belum login
        if (!$request->user()) {
            return redirect()->route('admin.login')
                ->with('error', 'Please login as admin first.');
        }

        // User login tapi bukan admin
        if (!$request->user()->isAdmin()) {
            // Kalau API request
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            // Kalau web request - redirect ke user dashboard
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Admin only.');
        }

        return $next($request);
    }
}
