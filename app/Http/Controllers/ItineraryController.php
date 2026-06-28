<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Zone;
use App\Models\Category;
use App\Models\Itinerary;
use App\Models\Destination;
use Illuminate\Http\Request;
use App\Services\ItineraryService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ItineraryController extends Controller
{
    protected ItineraryService $itineraryService;

    public function __construct(ItineraryService $itineraryService)
    {
        $this->itineraryService = $itineraryService;
    }

    /**
     * Get and cache reference data for itineraries to prevent expensive DB queries and mapping on every page load.
     */
    private function getReferenceData()
    {
        // ⚡ Bolt: Caching reference datasets (Cities, Zones, Categories, Destinations)
        // to reduce database querying and JSON serialization overhead for create/edit pages.
        return Cache::remember('itinerary_reference_data', 900, function () {
            $destinations = Destination::with(['zone', 'category', 'ticketVariants'])
                ->get()
                ->map(function ($destination) {
                    return [
                        'id' => $destination->id,
                        'name' => $destination->name,
                        'description' => $destination->description,
                        'latitude' => $destination->latitude,
                        'longitude' => $destination->longitude,
                        'avg_duration_minutes' => $destination->avg_duration_minutes,
                        'thumbnail' => $destination->thumbnail,
                        'zone' => $destination->zone,
                        'category' => $destination->category,
                        'ticket_variants' => $destination->ticketVariants,
                        'min_price' => $destination->ticketVariants->min('price') ?? 0,
                    ];
                });

            return [
                'cities' => City::all(),
                'zones' => Zone::with('city')->get(),
                'categories' => Category::all(),
                'destinations' => $destinations,
            ];
        });
    }

    /**
     * Display a listing of the user's itineraries.
     */
    public function index(Request $request)
    {
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            // ⚡ Bolt: Eager load relationships required by calculateBudgetBreakdown to prevent N+1 queries in the map loop
            ->with(['city', 'itineraryItems.itineraryItemDetails', 'itineraryLodgings'])
            ->withCount('itineraryItems')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($itinerary) {
                // Calculate budget for each itinerary
                $budget = $this->itineraryService->calculateBudgetBreakdown($itinerary);
                $itinerary->total_budget = $budget['total_budget'];
                return $itinerary;
            });

        return Inertia::render('Itinerary/Index', [
            'itineraries' => $itineraries,
        ]);
    }

    /**
     * Show the form for creating a new itinerary.
     */
    public function create(Request $request)
    {
        $referenceData = $this->getReferenceData();

        return Inertia::render('Itinerary/Create', [
            'cities' => $referenceData['cities'],
            'zones' => $referenceData['zones'],
            'categories' => $referenceData['categories'],
            'destinations' => $referenceData['destinations'],
        ]);
    }

    /**
     * Display the specified itinerary.
     */
    public function show(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)
            ->with([
                'city',
                'itineraryItems.destination.zone',
                'itineraryItems.destination.category',
                'itineraryItems.destination.ticketVariants',
                'itineraryItems.itineraryItemDetails',
                'itineraryLodgings',
            ])
            ->findOrFail($id);

        // Group items by day
        $itemsByDay = $itinerary->itineraryItems
            ->groupBy('day_number')
            ->map(function ($items) {
                return $items->sortBy('sequence_order')->values();
            });

        // Calculate budget breakdown
        $budget = $this->itineraryService->calculateBudgetBreakdown($itinerary);

        return Inertia::render('Itinerary/Show', [
            'itinerary' => $itinerary,
            'itemsByDay' => $itemsByDay,
            'budget' => $budget,
        ]);
    }

    /**
     * Show the form for editing the specified itinerary.
     */
    public function edit(Request $request, $id)
    {
        $itinerary = Itinerary::where('user_id', $request->user()->id)
            ->with([
                'city',
                'itineraryItems.destination.zone',
                'itineraryItems.destination.category',
                'itineraryItems.destination.ticketVariants',
                'itineraryItems.itineraryItemDetails',
                'itineraryLodgings',
            ])
            ->findOrFail($id);

        $referenceData = $this->getReferenceData();

        // Group items by day
        $itemsByDay = $itinerary->itineraryItems
            ->groupBy('day_number')
            ->map(function ($items) {
                return $items->sortBy('sequence_order')->values();
            });

        // Calculate budget breakdown
        $budget = $this->itineraryService->calculateBudgetBreakdown($itinerary);

        return Inertia::render('Itinerary/Edit', [
            'itinerary' => $itinerary,
            'itemsByDay' => $itemsByDay,
            'budget' => $budget,
            'cities' => $referenceData['cities'],
            'zones' => $referenceData['zones'],
            'categories' => $referenceData['categories'],
            'destinations' => $referenceData['destinations'],
        ]);
    }
}
