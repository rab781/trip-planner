<?php

namespace App\Services;

use App\Helpers\DistanceHelper;
use App\Models\Destination;
use App\Models\Itinerary;
use App\Models\ItineraryItem;
use Illuminate\Support\Collection;

class ItineraryService
{
    protected TransportService $transportService;

    public function __construct(TransportService $transportService)
    {
        $this->transportService = $transportService;
    }

    /**
     * Group destinations by zone and sort by nearest distance
     *
     * @param array $destinationIds Array of destination IDs
     * @return Collection Grouped and sorted destinations
     */
    public function groupAndSortDestinations(array $destinationIds): Collection
    {
        // Load destinations with zone relationship
        $destinations = Destination::with('zone')
            ->whereIn('id', $destinationIds)
            ->get();

        // Group by zone_id
        $grouped = $destinations->groupBy('zone_id');

        // Sort destinations within each zone by proximity
        $grouped = $grouped->map(function ($zoneDestinations) {
            return $this->sortByNearestNeighbor($zoneDestinations);
        });

        return $grouped;
    }

    /**
     * Sort destinations using Nearest Neighbor algorithm
     * to minimize total travel distance
     *
     * @param Collection $destinations
     * @return Collection Sorted destinations
     */
    protected function sortByNearestNeighbor(Collection $destinations): Collection
    {
        if ($destinations->count() <= 1) {
            return $destinations;
        }

        $sorted = collect();
        $remaining = $destinations->values();

        // Start with the first destination
        $current = $remaining->shift();
        $sorted->push($current);

        // Find nearest neighbor for each step
        while ($remaining->isNotEmpty()) {
            $nearest = null;
            $minDistance = PHP_FLOAT_MAX;

            foreach ($remaining as $index => $destination) {
                $distance = DistanceHelper::calculateDistance(
                    $current->latitude,
                    $current->longitude,
                    $destination->latitude,
                    $destination->longitude
                );

                if ($distance < $minDistance) {
                    $minDistance = $distance;
                    $nearest = $index;
                }
            }

            $current = $remaining->pull($nearest);
            $sorted->push($current);
        }

        return $sorted;
    }

    /**
     * Create itinerary items with calculated distances and transport costs
     *
     * @param Itinerary $itinerary
     * @param array $destinationIds
     * @param int $dayNumber
     * @param array|null $startLocation ['lat' => float, 'lng' => float] - Starting point (hotel/home)
     * @return Collection Created itinerary items
     */
    public function createItineraryItems(
        Itinerary $itinerary,
        array $destinationIds,
        int $dayNumber = 1,
        ?array $startLocation = null
    ): Collection {
        // Group and sort destinations
        $groupedDestinations = $this->groupAndSortDestinations($destinationIds);

        // Flatten to single sorted list (all zones)
        $sortedDestinations = $groupedDestinations->flatten(1);

        $items = collect();
        $sequence = 1;
        $previousLocation = $startLocation;

        foreach ($sortedDestinations as $destination) {
            $distanceFromPrev = null;
            $transportCost = null;
            $transportMode = null;

            // Calculate distance and cost from previous location
            if ($previousLocation) {
                $distanceFromPrev = DistanceHelper::calculateDistance(
                    $previousLocation['lat'],
                    $previousLocation['lng'],
                    $destination->latitude,
                    $destination->longitude
                );

                $transportCalc = $this->transportService->calculateTransportCost(
                    $distanceFromPrev,
                    $itinerary->total_pax_count
                );

                $transportCost = $transportCalc['cost'];
                $transportMode = $transportCalc['vehicle_type'];
            }

            // Create itinerary item
            $item = ItineraryItem::create([
                'itinerary_id' => $itinerary->id,
                'destination_id' => $destination->id,
                'day_number' => $dayNumber,
                'sequence_order' => $sequence,
                'dist_from_prev_km' => $distanceFromPrev,
                'est_transport_cost' => $transportCost,
                'transportation_mode' => $transportMode,
            ]);

            $items->push($item);

            // Update for next iteration
            $previousLocation = [
                'lat' => $destination->latitude,
                'lng' => $destination->longitude,
            ];
            $sequence++;
        }

        return $items;
    }

    /**
     * Recalculate distances and costs after reordering
     *
     * @param Itinerary $itinerary
     * @param array $newOrder Array of itinerary_item_ids in new sequence
     * @param array|null $startLocation Starting point for the day
     * @return Collection Updated itinerary items
     */
    public function recalculateAfterReorder(
        Itinerary $itinerary,
        array $newOrder,
        ?array $startLocation = null
    ): Collection {
        $items = ItineraryItem::whereIn('id', $newOrder)
            ->with('destination')
            ->get()
            ->sortBy(function ($item) use ($newOrder) {
                return array_search($item->id, $newOrder);
            })
            ->values();

        $previousLocation = $startLocation;
        $sequence = 1;

        foreach ($items as $item) {
            $distanceFromPrev = null;
            $transportCost = null;
            $transportMode = null;

            if ($previousLocation) {
                $distanceFromPrev = DistanceHelper::calculateDistance(
                    $previousLocation['lat'],
                    $previousLocation['lng'],
                    $item->destination->latitude,
                    $item->destination->longitude
                );

                $transportCalc = $this->transportService->calculateTransportCost(
                    $distanceFromPrev,
                    $itinerary->total_pax_count
                );

                $transportCost = $transportCalc['cost'];
                $transportMode = $transportCalc['vehicle_type'];
            }

            // Update item
            $item->update([
                'sequence_order' => $sequence,
                'dist_from_prev_km' => $distanceFromPrev,
                'est_transport_cost' => $transportCost,
                'transportation_mode' => $transportMode,
            ]);

            $previousLocation = [
                'lat' => $item->destination->latitude,
                'lng' => $item->destination->longitude,
            ];
            $sequence++;
        }

        return $items->fresh();
    }

    /**
     * Calculate total estimated budget for an itinerary
     *
     * @param Itinerary $itinerary
     * @return array Budget breakdown
     */
    public function calculateBudgetBreakdown(Itinerary $itinerary): array
    {
        $itinerary->load(['itineraryItems.destination.ticketVariants', 'itineraryItems.itemDetails', 'itineraryLodgings']);

        // Transport costs
        $transportCost = $itinerary->itineraryItems->sum('est_transport_cost') ?? 0;

        // Ticket costs (from item details)
        $ticketCost = $itinerary->itineraryItems
            ->flatMap(fn($item) => $item->itemDetails)
            ->sum('price') ?? 0;

        // Lodging costs
        $lodgingCost = $itinerary->itineraryLodgings->sum('total_cost') ?? 0;

        // Estimated food cost (rough estimate: Rp 50,000 per person per day)
        $foodCostPerDay = 50000;
        $totalDays = $itinerary->total_days;
        $estimatedFoodCost = $foodCostPerDay * $itinerary->total_pax_count * $totalDays;

        $totalBudget = $transportCost + $ticketCost + $lodgingCost + $estimatedFoodCost;

        return [
            'transport_cost' => $transportCost,
            'ticket_cost' => $ticketCost,
            'lodging_cost' => $lodgingCost,
            'estimated_food_cost' => $estimatedFoodCost,
            'total_budget' => $totalBudget,
            'breakdown' => [
                'fixed_costs' => $ticketCost + $lodgingCost,
                'variable_costs' => $transportCost + $estimatedFoodCost,
            ],
        ];
    }

    /**
     * Get optimized route suggestion for multiple destinations
     *
     * @param array $destinationIds
     * @return array Suggested route with total distance
     */
    public function getOptimizedRoute(array $destinationIds): array
    {
        $grouped = $this->groupAndSortDestinations($destinationIds);
        $sortedDestinations = $grouped->flatten(1);

        $totalDistance = 0;
        $route = [];
        $previousDestination = null;

        foreach ($sortedDestinations as $destination) {
            $distance = null;

            if ($previousDestination) {
                $distance = DistanceHelper::calculateDistance(
                    $previousDestination->latitude,
                    $previousDestination->longitude,
                    $destination->latitude,
                    $destination->longitude
                );
                $totalDistance += $distance;
            }

            $route[] = [
                'destination_id' => $destination->id,
                'destination_name' => $destination->name,
                'zone_name' => $destination->zone->name,
                'distance_from_prev' => $distance,
                'coordinates' => [
                    'lat' => (float) $destination->latitude,
                    'lng' => (float) $destination->longitude,
                ],
            ];

            $previousDestination = $destination;
        }

        return [
            'route' => $route,
            'total_distance_km' => round($totalDistance, 2),
            'total_destinations' => count($route),
        ];
    }
}
