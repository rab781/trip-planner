<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Zone;
use App\Models\Category;
use App\Models\Itinerary;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\ItineraryService;
use Inertia\Inertia;

class ItineraryController extends Controller
{
    protected ItineraryService $itineraryService;

    public function __construct(ItineraryService $itineraryService)
    {
        $this->itineraryService = $itineraryService;
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
        // ⚡ Bolt: Cache reference data to prevent heavy DB queries and JSON mapping on every load
        $cities = Cache::remember('reference_cities', 900, function () {
            return City::all();
        });

        $zones = Cache::remember('reference_zones', 900, function () {
            return Zone::with('city')->get();
        });

        $categories = Cache::remember('reference_categories', 900, function () {
            return Category::all();
        });

        $destinations = Cache::remember('reference_destinations', 900, function () {
            return Destination::with(['zone', 'category', 'ticketVariants'])
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
        });

        return Inertia::render('Itinerary/Create', [
            'cities' => $cities,
            'zones' => $zones,
            'categories' => $categories,
            'destinations' => $destinations,
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

        // ⚡ Bolt: Cache reference data to prevent heavy DB queries and JSON mapping on every load
        $cities = Cache::remember('reference_cities', 900, function () {
            return City::all();
        });

        $zones = Cache::remember('reference_zones', 900, function () {
            return Zone::with('city')->get();
        });

        $categories = Cache::remember('reference_categories', 900, function () {
            return Category::all();
        });

        $destinations = Cache::remember('reference_destinations', 900, function () {
            return Destination::with(['zone', 'category', 'ticketVariants'])
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
        });

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
            'cities' => $cities,
            'zones' => $zones,
            'categories' => $categories,
            'destinations' => $destinations,
        ]);
    }
}
