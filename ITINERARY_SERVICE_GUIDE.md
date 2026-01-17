# ItineraryService - Documentation

## Overview
Service untuk mengelola logic smart itinerary dengan fitur:
- ✅ Grouping destinasi berdasarkan Zone
- ✅ Sorting destinasi menggunakan Nearest Neighbor Algorithm
- ✅ Auto-calculate jarak & biaya transport
- ✅ Budget breakdown calculator

## Usage Examples

### 1. Group & Sort Destinations by Zone
```php
use App\Services\ItineraryService;

$itineraryService = app(ItineraryService::class);

$destinationIds = [1, 5, 3, 8, 2]; // IDs acak

// Akan di-group by zone_id dan diurutkan berdasarkan jarak terdekat
$grouped = $itineraryService->groupAndSortDestinations($destinationIds);

// Result: Collection grouped by zone_id
// Zone Lembang: [dest1, dest2, dest3]
// Zone Ciwidey: [dest4, dest5]
```

### 2. Create Itinerary Items with Auto-Calculate
```php
$itinerary = Itinerary::find(1);

// Starting dari hotel
$startLocation = [
    'lat' => -6.9175,
    'lng' => 107.6191
];

$items = $itineraryService->createItineraryItems(
    itinerary: $itinerary,
    destinationIds: [1, 5, 3, 8],
    dayNumber: 1,
    startLocation: $startLocation
);

// Otomatis menghitung:
// - dist_from_prev_km
// - est_transport_cost (berdasarkan pax_count)
// - transportation_mode (MOTOR/CAR)
// - sequence_order
```

### 3. Recalculate After Drag & Drop Reorder
```php
// User drag & drop itinerary items
$newOrder = [4, 1, 3, 2]; // New sequence of itinerary_item IDs

$updatedItems = $itineraryService->recalculateAfterReorder(
    itinerary: $itinerary,
    newOrder: $newOrder,
    startLocation: $startLocation
);

// Semua distance & cost akan di-recalculate otomatis
```

### 4. Calculate Budget Breakdown
```php
$budget = $itineraryService->calculateBudgetBreakdown($itinerary);

/*
Result:
[
    'transport_cost' => 150000,
    'ticket_cost' => 250000,
    'lodging_cost' => 500000,
    'estimated_food_cost' => 200000,
    'total_budget' => 1100000,
    'breakdown' => [
        'fixed_costs' => 750000,    // ticket + lodging
        'variable_costs' => 350000   // transport + food
    ]
]
*/
```

### 5. Get Optimized Route Suggestion
```php
$route = $itineraryService->getOptimizedRoute([1, 5, 3, 8, 2]);

/*
Result:
[
    'route' => [
        [
            'destination_id' => 1,
            'destination_name' => 'Tangkuban Perahu',
            'zone_name' => 'Lembang',
            'distance_from_prev' => null,
            'coordinates' => ['lat' => -6.7597, 'lng' => 107.6098]
        ],
        [
            'destination_id' => 5,
            'destination_name' => 'Farmhouse',
            'zone_name' => 'Lembang',
            'distance_from_prev' => 8.5,
            'coordinates' => ['lat' => -6.8103, 'lng' => 107.6176]
        ],
        // ...
    ],
    'total_distance_km' => 45.3,
    'total_destinations' => 5
]
*/
```

## API Controller Example

```php
// app/Http/Controllers/Api/ItineraryController.php

use App\Services\ItineraryService;

class ItineraryController extends Controller
{
    protected ItineraryService $itineraryService;

    public function __construct(ItineraryService $itineraryService)
    {
        $this->itineraryService = $itineraryService;
    }

    /**
     * POST /api/itinerary/preview-route
     * Preview optimized route before creating itinerary
     */
    public function previewRoute(Request $request)
    {
        $destinationIds = $request->input('destination_ids');
        
        $route = $this->itineraryService->getOptimizedRoute($destinationIds);
        
        return response()->json($route);
    }

    /**
     * POST /api/itinerary/{id}/reorder
     * Reorder itinerary items with auto-recalculate
     */
    public function reorder(Request $request, Itinerary $itinerary)
    {
        $newOrder = $request->input('new_order'); // [4, 1, 3, 2]
        $startLocation = $request->input('start_location'); // ['lat' => ..., 'lng' => ...]
        
        $items = $this->itineraryService->recalculateAfterReorder(
            $itinerary,
            $newOrder,
            $startLocation
        );
        
        return response()->json([
            'items' => $items->load('destination'),
            'budget' => $this->itineraryService->calculateBudgetBreakdown($itinerary)
        ]);
    }
}
```

## Algorithm: Nearest Neighbor

**Problem:** Mencari urutan destinasi dengan jarak tempuh minimal

**Solution:** Greedy algorithm - selalu pilih destinasi terdekat yang belum dikunjungi

**Steps:**
1. Mulai dari destinasi pertama
2. Cari destinasi terdekat yang belum dikunjungi (Haversine distance)
3. Pindah ke destinasi tersebut
4. Ulangi sampai semua destinasi terkunjungi

**Time Complexity:** O(n²) dimana n = jumlah destinasi per zone

**Trade-off:** Tidak menjamin solusi optimal global, tapi cukup efisien untuk use case wisata (biasanya < 10 destinasi per hari)

## Next Steps (Phase 3 & 4)

- [ ] Buat API endpoint untuk `previewRoute` dan `reorder`
- [ ] Integrate dengan React frontend (Drag & Drop)
- [ ] Add real-time budget update saat drag & drop
- [ ] Map visualization dengan Leaflet.js
