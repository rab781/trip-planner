<?php

namespace App\Http\Controllers\Api;

use App\Models\Itinerary;
use Illuminate\Http\Request;
use App\Models\ItineraryItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\ItineraryService;
use App\Services\ItineraryGeneratorService;
use App\Helpers\DistanceHelper;

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
    public function store(Request $request, ItineraryService $itineraryService)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_pax_count' => 'required|integer|min:1',
            'transportation_preference' => 'required|in:MOTOR,CAR',
            'destination_ids' => 'nullable|array',
            'destination_ids.*' => 'exists:destinations,id',
            'days' => 'nullable|array', // New format: array of days with destinations
            'days.*.day' => 'required_with:days|integer|min:1',
            'days.*.destinations' => 'required_with:days|array',
            'days.*.destinations.*.id' => 'required_with:days|exists:destinations,id',
        ]);

        $validated['user_id'] = $request->user()->id;

        // Calculate total days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;

        try {
            $itinerary = DB::transaction(function () use ($validated, $totalDays, $itineraryService) {
                // Create the itinerary
                $itinerary = Itinerary::create([
                    'user_id' => $validated['user_id'],
                    'city_id' => $validated['city_id'],
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'total_pax_count' => $validated['total_pax_count'],
                    'transportation_preference' => $validated['transportation_preference'],
                ]);

                // Pre-fetch all destinations to avoid N+1 query problem
                $allDestIds = [];
                if (!empty($validated['days'])) {
                    foreach ($validated['days'] as $dayData) {
                        foreach ($dayData['destinations'] as $destData) {
                            $allDestIds[] = is_array($destData) ? $destData['id'] : $destData;
                        }
                    }
                } elseif (!empty($validated['destination_ids'])) {
                    $allDestIds = $validated['destination_ids'];
                }

                if (empty($allDestIds)) {
                    $destinationsMap = collect();
                } else {
                    $destinationsMap = \App\Models\Destination::whereIn('id', array_unique($allDestIds))->get()->keyBy('id');
                }

                // ⚡ Bolt: Use an array to collect items for a single bulk insert instead of N+1 create() queries inside the loop
                $itemsToInsert = [];
                $now = now();

                // Handle days format (preferred - from GeneratedItinerary)
                if (!empty($validated['days'])) {
                    foreach ($validated['days'] as $dayData) {
                        $dayNumber = $dayData['day'];
                        $sequence = 1;
                        $prevDestination = null;

                        foreach ($dayData['destinations'] as $destData) {
                            $destinationId = is_array($destData) ? $destData['id'] : $destData;
                            $destination = $destinationsMap->get($destinationId);

                            if (!$destination) continue;

                            // Calculate distance from previous destination
                            $distFromPrev = 0;
                            $estTransportCost = 0;

                            if ($prevDestination) {
                                $distFromPrev = DistanceHelper::calculateDistance(
                                    $prevDestination->latitude,
                                    $prevDestination->longitude,
                                    $destination->latitude,
                                    $destination->longitude
                                );
                                // Estimate transport cost: ~Rp 3000/km for motor, ~Rp 5000/km for car
                                $costPerKm = $validated['transportation_preference'] === 'MOTOR' ? 3000 : 5000;
                                $estTransportCost = $distFromPrev * $costPerKm;
                            }

                            $itemsToInsert[] = [
                                'itinerary_id' => $itinerary->id,
                                'destination_id' => $destinationId,
                                'day_number' => $dayNumber,
                                'sequence_order' => $sequence,
                                'dist_from_prev_km' => $distFromPrev,
                                'est_transport_cost' => $estTransportCost,
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];

                            $prevDestination = $destination;
                            $sequence++;
                        }
                    }
                }
                // Handle flat destination_ids format (legacy)
                elseif (!empty($validated['destination_ids'])) {
                    $destinations = $validated['destination_ids'];
                    $destinationsPerDay = ceil(count($destinations) / $totalDays);

                    $dayNumber = 1;
                    $sequence = 1;
                    $itemsInCurrentDay = 0;
                    $prevDestination = null;

                    foreach ($destinations as $destId) {
                        $destination = $destinationsMap->get($destId);
                        if (!$destination) continue;

                        // Calculate distance from previous destination
                        $distFromPrev = 0;
                        $estTransportCost = 0;

                        if ($prevDestination && $itemsInCurrentDay > 0) {
                            $distFromPrev = DistanceHelper::calculateDistance(
                                $prevDestination->latitude,
                                $prevDestination->longitude,
                                $destination->latitude,
                                $destination->longitude
                            );
                            // Estimate transport cost: ~Rp 3000/km for motor, ~Rp 5000/km for car
                            $costPerKm = $validated['transportation_preference'] === 'MOTOR' ? 3000 : 5000;
                            $estTransportCost = $distFromPrev * $costPerKm;
                        }

                        $itemsToInsert[] = [
                            'itinerary_id' => $itinerary->id,
                            'destination_id' => $destId,
                            'day_number' => $dayNumber,
                            'sequence_order' => $sequence,
                            'dist_from_prev_km' => $distFromPrev,
                            'est_transport_cost' => $estTransportCost,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];

                        $prevDestination = $destination;
                        $itemsInCurrentDay++;
                        $sequence++;

                        // Move to next day if needed
                        if ($itemsInCurrentDay >= $destinationsPerDay && $dayNumber < $totalDays) {
                            $dayNumber++;
                            $itemsInCurrentDay = 0;
                            $sequence = 1;
                            $prevDestination = null; // Reset for new day
                        }
                    }
                }

                if (!empty($itemsToInsert)) {
                    ItineraryItem::insert($itemsToInsert);
                }

                return $itinerary;
            });

            // Load the itinerary with items
            $itinerary->load(['itineraryItems.destination', 'city']);

            return response()->json([
                'success' => true,
                'data' => $itinerary,
                'message' => 'Itinerary created successfully',
                'status' => 201,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Itinerary creation failed: ' . $e->getMessage(),
                'status' => 500,
            ], 500);
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

    /**
     * Sync itinerary items - add new items and remove deleted ones
     * PUT /api/itineraries/{id}/sync-items
     */
    public function syncItems(Request $request, $id, ItineraryService $itineraryService)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)->find($id);

        if (!$itinerary) {
            return response()->json([
                'success' => false,
                'message' => 'Itinerary not found',
            ], 404);
        }

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*' => 'array',
            'items.*.destination_id' => 'required|exists:destinations,id',
            'items.*.day_number' => 'required|integer|min:1',
            'items.*.sequence_order' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($itinerary, $validated, $itineraryService) {
                // Delete all existing items
                $itinerary->itineraryItems()->delete();

                // Pre-fetch all destinations to avoid N+1 query problem
                $allDestIds = collect($validated['items'])->pluck('destination_id')->unique()->toArray();
                $destinationsMap = empty($allDestIds)
                    ? collect()
                    : \App\Models\Destination::whereIn('id', $allDestIds)->get()->keyBy('id');

                // Re-create items from request
                $itemsByDay = collect($validated['items'])->groupBy('day_number');
                
                // ⚡ Bolt: Use an array to collect items for a single bulk insert instead of N+1 create() queries inside the loop
                $itemsToInsert = [];
                $now = now();

                foreach ($itemsByDay as $dayNumber => $dayItems) {
                    $prevDestination = null;
                    $sequence = 1;

                    foreach ($dayItems->sortBy('sequence_order') as $itemData) {
                        $destination = $destinationsMap->get($itemData['destination_id']);
                        if (!$destination) continue;

                        // Calculate distance from previous destination
                        $distFromPrev = 0;
                        $estTransportCost = 0;

                        if ($prevDestination) {
                            $distFromPrev = DistanceHelper::calculateDistance(
                                $prevDestination->latitude,
                                $prevDestination->longitude,
                                $destination->latitude,
                                $destination->longitude
                            );
                            // Estimate transport cost: ~Rp 3000/km for motor, ~Rp 5000/km for car
                            $costPerKm = $itinerary->transportation_preference === 'MOTOR' ? 3000 : 5000;
                            $estTransportCost = $distFromPrev * $costPerKm;
                        }

                        $itemsToInsert[] = [
                            'itinerary_id' => $itinerary->id,
                            'destination_id' => $itemData['destination_id'],
                            'day_number' => $dayNumber,
                            'sequence_order' => $sequence,
                            'dist_from_prev_km' => $distFromPrev,
                            'est_transport_cost' => $estTransportCost,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];

                        $prevDestination = $destination;
                        $sequence++;
                    }
                }

                if (!empty($itemsToInsert)) {
                    ItineraryItem::insert($itemsToInsert);
                }
            });

            // Reload with items
            $itinerary->load(['itineraryItems.destination']);
            $budget = $itineraryService->calculateBudgetBreakdown($itinerary);

            return response()->json([
                'success' => true,
                'data' => [
                    'itinerary' => $itinerary,
                    'budget' => $budget,
                ],
                'message' => 'Items synced successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync items: ' . $e->getMessage(),
            ], 500);
        }
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
