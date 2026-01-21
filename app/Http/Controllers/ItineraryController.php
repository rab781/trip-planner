<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Zone;
use App\Models\Category;
use App\Models\Itinerary;
use App\Models\Destination;
use Illuminate\Http\Request;
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
            ->with(['city', 'itineraryItems.destination'])
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
        $cities = City::all();
        $zones = Zone::with('city')->get();
        $categories = Category::all();
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

        $cities = City::all();
        $zones = Zone::with('city')->get();
        $categories = Category::all();
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
