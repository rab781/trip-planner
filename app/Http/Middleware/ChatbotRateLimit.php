<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ChatbotRateLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get user identifier (IP or user ID if authenticated)
        $key = $this->resolveRequestIdentifier($request);

        // Rate limit: 10 messages per minute per user
        $maxAttempts = 10;
        $decayMinutes = 1;

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'success' => false,
                'message' => "Terlalu banyak pesan. Silakan tunggu {$seconds} detik sebelum mengirim pesan lagi. ⏳",
                'retry_after' => $seconds
            ], 429);
        }

        RateLimiter::hit($key, $decayMinutes * 60);

        return $next($request);
    }

    /**
     * Resolve the request identifier for rate limiting
     */
    protected function resolveRequestIdentifier(Request $request): string
    {
        // Prioritize authenticated user ID, fallback to IP
        if ($request->user()) {
            return 'chatbot:user:' . $request->user()->id;
        }

        return 'chatbot:ip:' . $request->ip();
    }
}
