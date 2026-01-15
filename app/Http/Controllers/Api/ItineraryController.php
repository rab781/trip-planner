<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Itinerary;
use Illuminate\Http\Request;

class ItineraryController extends Controller
{
    // Get /api/itineraries
    public function index(Request $request)
    {
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->with(['city', 'itineraryItems.destination'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            [
                'data' => $itineraries,
                'message' => 'Itineraries retrieved successfully',
                'status' => 200,
            ]
        );

        if ($itineraries->isEmpty()) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No itineraries found',
                    'status' => 404,
                ],
                404
            );
        }
    
    }

    // Post /api/itineraries
    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_pax_count' => 'required|integer|min:1',
            'transportation_preference' => 'required|in:MOTOR,CAR',
        ]);

        $validated['user_id'] = $request->user()->id;

        $itinerary = Itinerary::create($validated);

        return response()->json(
            [
                'data' => $itinerary,
                'message' => 'Itinerary created successfully',
                'status' => 201,
            ],
            201
        );

        if (!$itinerary) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Itinerary creation failed',
                    'status' => 500,
                ],
                500
            );
        }
    }
}
