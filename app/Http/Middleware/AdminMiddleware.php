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
        if (!$request->user() || !$request->user()->isAdmin()){
            if($request->is('api/*')){
                return response()->json([
                    'message' => 'Forbidden. Admins only.'
                ], 403);
            }
            abort(403, 'Forbidden. Admins only.');
        }
        return $next($request);
    }
}
