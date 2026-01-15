<?php

namespace App\Http\Controllers\Api;

use App\Models\Itinerary;
use Illuminate\Http\Request;
use App\Models\ItineraryItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

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

    // Get /api/itineraries/{id}
    public function show(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)
            ->with(['city', 'itineraryItems.destination', 'itineraryLodgings', 'itineraryItems.itineraryItemDetails'])
            ->find($id);

        if ($itinerary) {
            return response()->json(
                [
                    'data' => $itinerary,
                    'message' => 'Itinerary retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Itinerary not found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Put /api/itineraries/{id}
    public function update(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)->find($id);

        if (!$itinerary) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Itinerary not found',
                    'status' => 404,
                ],
                404
            );
        }

        // Security check
        if ($itinerary->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'city_id' => 'sometimes|required|exists:cities,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'total_pax_count' => 'sometimes|required|integer|min:1',
            'transportation_preference' => 'sometimes|required|in:MOTOR,CAR',
        ]);

        $itinerary->update($validated);

        return response()->json(
            [
                'data' => $itinerary,
                'message' => 'Itinerary updated successfully',
                'status' => 200,
            ]
        );
    }

    // Delete /api/itineraries/{id}
    public function destroy(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)->find($id);

        if (!$itinerary) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Itinerary not found',
                    'status' => 404,
                ],
                404
            );
        }

        // Security check
        if ($itinerary->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $itinerary->delete();

        return response()->json(
            [
                'data' => null,
                'message' => 'Itinerary deleted successfully',
                'status' => 200,
            ]
        );
    }

    // Put /api/itineraries/{id}/reorder
    public function reorder(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)->find($id);

        if (!$itinerary) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Itinerary not found',
                    'status' => 404,
                ],
                404
            );
        }

         $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:itinerary_items,id',
            'items.*.sequence_order' => 'required|integer',
            'items.*.day_number' => 'required|integer',
        ]);
        
        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                ItineraryItem::where('id', $itemData['id'])->update([
                    'sequence_order' => $itemData['sequence_order'],
                    'day_number' => $itemData['day_number'],
                ]);
            }
        });

        return response()->json(
            [
                'data' => null,
                'message' => 'Itinerary items reordered successfully',
                'status' => 200,
            ]
        );
    }
}
