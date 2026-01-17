<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //Get /admin/dashboard
    public function index()
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_itineraries' => \App\Models\Itinerary::count(),
            'total_destinations' => \App\Models\Destination::count(),
            'recent_users' => \App\Models\User::latest()->take(5)->get(),
        ];
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    //Get /admin/reports
    public function reports()
    {
        $data = [
            'itineraries_per_destination' => \App\Models\Destination::withCount('itineraries')->get(),
            'users_with_most_itineraries' => \App\Models\User::withCount('itineraries')->orderBy('itineraries_count', 'desc')->take(5)->get(),
            'popular_destinations' => \App\Models\Itinerary::select('destination_id', DB::raw('count(*) as total'))->groupBy('destination_id')->orderBy('total', 'desc')->with('destination')->take(5)->get(),
            'active_users_last_month' => \App\Models\User::whereHas('itineraries', function ($query) {
                $query->where('created_at', '>=', now()->subMonth());
            })->count(),
            ];

        return Inertia::render('Admin/Reports', [
            'data' => $data,
        ]);
    }

    public function stats(Request $request)
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_itineraries' => \App\Models\Itinerary::count(),
            'total_destinations' => \App\Models\Destination::count(),
        ];

        return response()->json([
            'data' => $stats,
            'message' => 'Admin stats retrieved successfully',
            'status' => 200,
        ]);

        if (!$stats) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No stats found',
                    'status' => 404,
                ],
                404
            );
        }
    }
}
