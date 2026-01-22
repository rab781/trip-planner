<?php

namespace App\Http\Controllers\Api;

use App\Models\Itinerary;
use Illuminate\Http\Request;
use App\Models\ItineraryItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\ItineraryService;
use App\Services\ItineraryGeneratorService;

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
    public function reorder(Request $request, $id, ItineraryService $itineraryService)
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
            'items.*.day_number' => 'required|integer',
            'start_location' => 'nullable|array',
            'start_location.lat' => 'required_with:start_location|numeric',
            'start_location.lng' => 'required_with:start_location|numeric',
        ]);

        // Group items by day and recalculate
        $itemsByDay = collect($validated['items'])->groupBy('day_number');
        $startLocation = $validated['start_location'] ?? null;

        $updatedItems = collect();

        DB::transaction(function () use ($itemsByDay, $itinerary, $itineraryService, $startLocation, &$updatedItems) {
            foreach ($itemsByDay as $dayNumber => $dayItems) {
                // Extract item IDs in new order
                $newOrder = $dayItems->pluck('id')->toArray();

                // Update day_number for each item first
                foreach ($dayItems as $itemData) {
                    ItineraryItem::where('id', $itemData['id'])->update([
                        'day_number' => $itemData['day_number'],
                    ]);
                }

                // Use ItineraryService to recalculate distances and transport costs
                $recalculated = $itineraryService->recalculateAfterReorder(
                    $itinerary,
                    $newOrder,
                    $startLocation
                );

                $updatedItems = $updatedItems->merge($recalculated);
            }
        });

        // Reload itinerary with updated items and budget
        $itinerary->load(['itineraryItems.destination', 'itineraryItems.itineraryItemDetails']);
        $budgetBreakdown = $itineraryService->calculateBudgetBreakdown($itinerary);

        return response()->json(
            [
                'data' => [
                    'items' => $updatedItems,
                    'budget' => $budgetBreakdown,
                ],
                'message' => 'Itinerary items reordered and recalculated successfully',
                'status' => 200,
            ]
        );
    }

    /**
     * Generate itinerary based on preferences (AI-powered)
     * POST /api/itineraries/generate
     */
    public function generate(Request $request, ItineraryGeneratorService $generatorService)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_pax_count' => 'required|integer|min:1',
            'transportation_preference' => 'required|in:MOTOR,CAR',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'priority' => 'required|in:balanced,budget,popular,rating',
            'pace' => 'required|in:relaxed,normal,packed',
            'budget_per_day' => 'nullable|integer|min:0',
            'solo_mode' => 'boolean',
        ]);

        // Calculate total days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;

        $preferences = [
            'city_id' => $validated['city_id'],
            'total_days' => $totalDays,
            'total_pax_count' => $validated['total_pax_count'],
            'transportation_preference' => $validated['transportation_preference'],
            'categories' => $validated['categories'],
            'priority' => $validated['priority'],
            'pace' => $validated['pace'],
            'budget_per_day' => $validated['budget_per_day'] ?? null,
            'solo_mode' => $validated['solo_mode'] ?? false,
        ];

        try {
            $result = $generatorService->generate($preferences);

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => 'Itinerary generated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate itinerary: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Regenerate a specific day
     * POST /api/itineraries/regenerate-day
     */
    public function regenerateDay(Request $request, ItineraryGeneratorService $generatorService)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'day_number' => 'required|integer|min:1',
            'total_days' => 'required|integer|min:1',
            'total_pax_count' => 'required|integer|min:1',
            'transportation_preference' => 'required|in:MOTOR,CAR',
            'categories' => 'required|array|min:1',
            'priority' => 'required|in:balanced,budget,popular,rating',
            'pace' => 'required|in:relaxed,normal,packed',
            'exclude_ids' => 'array',
            'exclude_ids.*' => 'integer',
            'solo_mode' => 'boolean',
        ]);

        $preferences = [
            'city_id' => $validated['city_id'],
            'total_days' => $validated['total_days'],
            'total_pax_count' => $validated['total_pax_count'],
            'transportation_preference' => $validated['transportation_preference'],
            'categories' => $validated['categories'],
            'priority' => $validated['priority'],
            'pace' => $validated['pace'],
            'solo_mode' => $validated['solo_mode'] ?? false,
        ];

        try {
            $result = $generatorService->regenerateDay(
                $preferences,
                $validated['day_number'],
                $validated['exclude_ids'] ?? []
            );

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => 'Day regenerated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to regenerate day: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Suggest replacement for a destination
     * POST /api/itineraries/suggest-replacement
     */
    public function suggestReplacement(Request $request, ItineraryGeneratorService $generatorService)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'exclude_id' => 'required|exists:destinations,id',
            'category_id' => 'nullable|exists:categories,id',
            'priority' => 'required|in:balanced,budget,popular,rating',
            'solo_mode' => 'boolean',
            'limit' => 'integer|min:1|max:10',
        ]);

        try {
            $suggestions = $generatorService->suggestReplacement(
                $validated['city_id'],
                $validated['exclude_id'],
                $validated['category_id'] ?? null,
                $validated['priority'],
                $validated['solo_mode'] ?? false,
                $validated['limit'] ?? 5
            );

            return response()->json([
                'success' => true,
                'data' => $suggestions,
                'message' => 'Replacement suggestions retrieved',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get suggestions: ' . $e->getMessage(),
            ], 500);
        }
    }
}
