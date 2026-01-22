<?php

namespace App\Services;

use App\Helpers\DistanceHelper;
use App\Models\Destination;
use App\Models\ItineraryItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ItineraryGeneratorService
{
    protected ItineraryService $itineraryService;
    protected TransportService $transportService;

    // Weight configurations by priority
    protected array $weightConfigs = [
        'balanced' => [
            'rating' => 0.30,
            'price' => 0.25,
            'popularity' => 0.25,
            'time_match' => 0.20,
        ],
        'budget' => [
            'rating' => 0.20,
            'price' => 0.40,
            'popularity' => 0.20,
            'time_match' => 0.20,
        ],
        'popular' => [
            'rating' => 0.25,
            'price' => 0.20,
            'popularity' => 0.40,
            'time_match' => 0.15,
        ],
        'rating' => [
            'rating' => 0.45,
            'price' => 0.20,
            'popularity' => 0.20,
            'time_match' => 0.15,
        ],
    ];

    // Pace configurations (destinations per day)
    protected array $paceConfigs = [
        'relaxed' => ['min' => 2, 'max' => 3, 'default' => 2],
        'normal' => ['min' => 3, 'max' => 4, 'default' => 4],
        'packed' => ['min' => 5, 'max' => 6, 'default' => 5],
    ];

    public function __construct(ItineraryService $itineraryService, TransportService $transportService)
    {
        $this->itineraryService = $itineraryService;
        $this->transportService = $transportService;
    }

    /**
     * Generate itinerary based on user preferences
     */
    public function generate(array $preferences): array
    {
        $cityId = $preferences['city_id'];
        $categories = $preferences['categories'] ?? [];
        $priority = $preferences['priority'] ?? 'balanced';
        $pace = $preferences['pace'] ?? 'normal';
        $totalDays = $preferences['total_days'];
        $totalPax = $preferences['total_pax_count'] ?? 2;
        $transportPreference = $preferences['transportation_preference'] ?? 'CAR';
        $budgetPerDay = $preferences['budget_per_day'] ?? null;
        $isSoloMode = $preferences['solo_mode'] ?? false;

        // Get pace configuration
        $paceConfig = $this->paceConfigs[$pace] ?? $this->paceConfigs['normal'];
        $destinationsPerDay = $paceConfig['default'];
        $totalNeeded = $destinationsPerDay * $totalDays;

        // Get weights based on priority
        $weights = $this->getWeightsByPriority($priority);

        // Add solo weight if in solo mode
        if ($isSoloMode) {
            $weights['solo_friendly'] = 0.15;
            // Reduce other weights proportionally
            foreach (['rating', 'price', 'popularity', 'time_match'] as $key) {
                $weights[$key] *= 0.85;
            }
        }

        // Step 1: Filter destinations by category and city
        $destinations = $this->filterDestinations($cityId, $categories);

        // Step 2: Get popularity data
        $popularityData = $this->getPopularityData();

        // Step 3: Get price data for normalization
        $priceStats = $this->getPriceStats($destinations);

        // Step 4: Calculate score for each destination
        $scoredDestinations = $this->calculateScores(
            $destinations,
            $weights,
            $popularityData,
            $priceStats,
            $isSoloMode
        );

        // Step 5: Select top destinations
        $selectedDestinations = $scoredDestinations->take($totalNeeded);

        // Step 6: Check if fallback needed
        $fallbackUsed = false;
        $fallbackMessage = null;
        $fallbackCount = 0;

        if ($selectedDestinations->count() < $totalNeeded) {
            $fallbackResult = $this->applyFallback(
                $selectedDestinations,
                $totalNeeded,
                $cityId,
                $categories,
                $weights,
                $popularityData,
                $priceStats,
                $isSoloMode
            );

            $selectedDestinations = $fallbackResult['destinations'];
            $fallbackUsed = $fallbackResult['fallback_used'];
            $fallbackMessage = $fallbackResult['message'];
            $fallbackCount = $fallbackResult['count'];
        }

        // Step 7: Distribute destinations to days
        $days = $this->distributeToDays(
            $selectedDestinations,
            $totalDays,
            $destinationsPerDay
        );

        // Step 8: Optimize route per day
        $optimizedDays = $this->optimizeRoutesPerDay($days);

        // Step 9: Calculate complete budget
        $completeBudget = $this->calculateCompleteBudget(
            $optimizedDays,
            $totalPax,
            $transportPreference,
            $budgetPerDay
        );

        return [
            'success' => true,
            'data' => [
                'days' => $optimizedDays,
                'total_destinations' => $selectedDestinations->count(),
                'fallback_used' => $fallbackUsed,
                'fallback_message' => $fallbackMessage,
                'fallback_count' => $fallbackCount,
                'complete_budget' => $completeBudget,
                'preferences_used' => [
                    'priority' => $priority,
                    'pace' => $pace,
                    'solo_mode' => $isSoloMode,
                ],
            ],
        ];
    }

    /**
     * Get weight configuration by priority
     */
    public function getWeightsByPriority(string $priority): array
    {
        return $this->weightConfigs[$priority] ?? $this->weightConfigs['balanced'];
    }

    /**
     * Filter destinations by city and categories
     */
    protected function filterDestinations(int $cityId, array $categoryIds = []): Collection
    {
        $query = Destination::with(['zone', 'category', 'ticketVariants'])
            ->whereHas('zone', fn($q) => $q->where('city_id', $cityId));

        if (!empty($categoryIds)) {
            $query->whereIn('category_id', $categoryIds);
        }

        return $query->get();
    }

    /**
     * Get popularity data (usage count in itineraries)
     */
    protected function getPopularityData(): Collection
    {
        return Cache::remember('destination_popularity', 3600, function () {
            return ItineraryItem::select('destination_id', DB::raw('COUNT(*) as usage_count'))
                ->groupBy('destination_id')
                ->pluck('usage_count', 'destination_id');
        });
    }

    /**
     * Get price statistics for normalization
     */
    protected function getPriceStats(Collection $destinations): array
    {
        $prices = $destinations->map(function ($dest) {
            return $dest->ticketVariants->min('price') ?? 0;
        })->filter(fn($p) => $p > 0);

        if ($prices->isEmpty()) {
            return ['min' => 0, 'max' => 100000, 'range' => 100000];
        }

        $min = $prices->min();
        $max = $prices->max();

        return [
            'min' => $min,
            'max' => $max,
            'range' => max($max - $min, 1),
        ];
    }

    /**
     * Calculate scores for all destinations
     */
    protected function calculateScores(
        Collection $destinations,
        array $weights,
        Collection $popularityData,
        array $priceStats,
        bool $isSoloMode
    ): Collection {
        $maxPopularity = $popularityData->max() ?: 1;

        $scored = $destinations->map(function ($dest) use ($weights, $popularityData, $priceStats, $maxPopularity, $isSoloMode) {
            $scores = [];

            // Rating score (0-100)
            $ratingScore = (($dest->rating ?? 0) / 5) * 100;
            $scores['rating'] = $ratingScore;

            // Price score (inverse - cheaper is better, 0-100)
            $minPrice = $dest->ticketVariants->min('price') ?? 0;
            if ($priceStats['range'] > 0 && $minPrice > 0) {
                $priceScore = 100 - (($minPrice - $priceStats['min']) / $priceStats['range'] * 100);
            } else {
                $priceScore = 100; // Free entry
            }
            $scores['price'] = $priceScore;

            // Popularity score (0-100)
            $usageCount = $popularityData->get($dest->id, 0);
            $popularityScore = ($usageCount / $maxPopularity) * 100;
            $scores['popularity'] = $popularityScore;

            // Time match score (simplified - based on best_visit_time)
            $timeScore = 50; // Default middle score
            if ($dest->best_visit_time) {
                $hour = (int) substr($dest->best_visit_time, 0, 2);
                // Morning destinations (8-11) get bonus
                if ($hour >= 8 && $hour <= 11) {
                    $timeScore = 80;
                }
            }
            $scores['time_match'] = $timeScore;

            // Solo friendly score (0-100)
            if ($isSoloMode) {
                $soloScore = (($dest->solo_friendly_score ?? 3) / 5) * 100;
                $scores['solo_friendly'] = $soloScore;
            }

            // Calculate weighted total
            $totalScore = 0;
            foreach ($weights as $key => $weight) {
                $totalScore += ($scores[$key] ?? 0) * $weight;
            }

            // Generate badges
            $badges = $this->generateBadges($dest, $scores, $priceStats, $maxPopularity, $isSoloMode);

            $dest->calculated_score = round($totalScore, 1);
            $dest->score_breakdown = $scores;
            $dest->badges = $badges;
            $dest->min_ticket_price = $minPrice;

            return $dest;
        });

        return $scored->sortByDesc('calculated_score')->values();
    }

    /**
     * Generate badges for a destination
     */
    public function generateBadges(
        Destination $dest,
        array $scores,
        array $priceStats,
        float $maxPopularity,
        bool $isSoloMode
    ): array {
        $badges = [];

        // Rating badge
        if (($dest->rating ?? 0) >= 4.5) {
            $badges[] = ['icon' => '⭐', 'label' => 'Rating Tinggi', 'type' => 'rating'];
        }

        // Budget badge (bottom 25% price)
        $minPrice = $dest->ticketVariants->min('price') ?? 0;
        $priceThreshold = $priceStats['min'] + ($priceStats['range'] * 0.25);
        if ($minPrice <= $priceThreshold || $minPrice == 0) {
            $badges[] = ['icon' => '💰', 'label' => 'Hemat', 'type' => 'budget'];
        }

        // Popularity badge (top 25%)
        $usageCount = ItineraryItem::where('destination_id', $dest->id)->count();
        if ($usageCount >= ($maxPopularity * 0.75)) {
            $badges[] = ['icon' => '🔥', 'label' => 'Populer', 'type' => 'popular'];
        }

        // Solo-friendly badge
        if ($isSoloMode && ($dest->solo_friendly_score ?? 3) >= 4) {
            $badges[] = ['icon' => '👤', 'label' => 'Solo-Friendly', 'type' => 'solo'];
        }

        // Family-friendly badge
        if ($dest->category_id == 6) {
            $badges[] = ['icon' => '👨‍👩‍👧', 'label' => 'Ramah Keluarga', 'type' => 'family'];
        }

        // Photo spot badge
        $activities = $dest->activities ?? [];
        $hasPhotoSpot = collect($activities)->contains(fn($a) => !empty($a['photo_spot']));
        if ($hasPhotoSpot) {
            $badges[] = ['icon' => '📸', 'label' => 'Instagramable', 'type' => 'photo'];
        }

        return $badges;
    }

    /**
     * Apply fallback when not enough destinations in selected categories
     */
    protected function applyFallback(
        Collection $selected,
        int $needed,
        int $cityId,
        array $excludeCategories,
        array $weights,
        Collection $popularityData,
        array $priceStats,
        bool $isSoloMode
    ): array {
        $stillNeeded = $needed - $selected->count();

        if ($stillNeeded <= 0) {
            return [
                'destinations' => $selected,
                'fallback_used' => false,
                'message' => null,
                'count' => 0,
            ];
        }

        // Get destinations from other categories
        $fallbackDestinations = Destination::with(['zone', 'category', 'ticketVariants'])
            ->whereHas('zone', fn($q) => $q->where('city_id', $cityId))
            ->when(!empty($excludeCategories), function ($q) use ($excludeCategories) {
                $q->whereNotIn('category_id', $excludeCategories);
            })
            ->whereNotIn('id', $selected->pluck('id'))
            ->get();

        if ($fallbackDestinations->isEmpty()) {
            return [
                'destinations' => $selected,
                'fallback_used' => false,
                'message' => null,
                'count' => 0,
            ];
        }

        // Score fallback destinations
        $maxPopularity = $popularityData->max() ?: 1;
        $scoredFallback = $this->calculateScores(
            $fallbackDestinations,
            $weights,
            $popularityData,
            $priceStats,
            $isSoloMode
        );

        // Take needed amount
        $toAdd = $scoredFallback->take($stillNeeded);

        // Get category names for message
        $fallbackCategories = $toAdd->pluck('category.name')->unique()->implode(', ');

        return [
            'destinations' => $selected->concat($toAdd)->values(),
            'fallback_used' => true,
            'message' => "{$toAdd->count()} destinasi dari kategori {$fallbackCategories} ditambahkan untuk melengkapi itinerary",
            'count' => $toAdd->count(),
        ];
    }

    /**
     * Distribute destinations to days, grouping by zone
     */
    protected function distributeToDays(Collection $destinations, int $totalDays, int $perDay): array
    {
        $days = [];

        // Group by zone for efficiency
        $byZone = $destinations->groupBy('zone_id');

        $dayIndex = 1;
        $currentDayDestinations = collect();

        foreach ($byZone as $zoneId => $zoneDestinations) {
            foreach ($zoneDestinations as $dest) {
                $currentDayDestinations->push($dest);

                if ($currentDayDestinations->count() >= $perDay) {
                    $days[$dayIndex] = $currentDayDestinations->values()->all();
                    $currentDayDestinations = collect();
                    $dayIndex++;

                    if ($dayIndex > $totalDays) {
                        break 2;
                    }
                }
            }
        }

        // Add remaining destinations to last day
        if ($currentDayDestinations->isNotEmpty() && $dayIndex <= $totalDays) {
            $days[$dayIndex] = $currentDayDestinations->values()->all();
        }

        // Fill empty days
        while (count($days) < $totalDays) {
            $days[count($days) + 1] = [];
        }

        return $days;
    }

    /**
     * Optimize routes for each day using nearest neighbor
     */
    protected function optimizeRoutesPerDay(array $days): array
    {
        $optimized = [];

        foreach ($days as $dayNum => $destinations) {
            if (empty($destinations)) {
                $optimized[] = [
                    'day' => $dayNum,
                    'destinations' => [],
                ];
                continue;
            }

            // Convert to collection and sort by nearest neighbor
            $destCollection = collect($destinations);
            $sorted = $this->sortByNearestNeighbor($destCollection);

            // Format destinations for response
            $formattedDestinations = $sorted->map(function ($dest, $index) use ($sorted) {
                $distanceFromPrev = null;

                if ($index > 0) {
                    $prev = $sorted[$index - 1];
                    $distanceFromPrev = DistanceHelper::calculateDistance(
                        $prev->latitude,
                        $prev->longitude,
                        $dest->latitude,
                        $dest->longitude
                    );
                }

                return [
                    'id' => $dest->id,
                    'name' => $dest->name,
                    'description' => $dest->description,
                    'image_url' => $dest->image_url,
                    'category' => $dest->category->name ?? null,
                    'category_id' => $dest->category_id,
                    'zone' => $dest->zone->name ?? null,
                    'zone_id' => $dest->zone_id,
                    'score' => $dest->calculated_score ?? 0,
                    'badges' => $dest->badges ?? [],
                    'min_ticket_price' => $dest->min_ticket_price ?? 0,
                    'avg_duration' => $dest->avg_visit_duration_minutes,
                    'rating' => (float) $dest->rating,
                    'opening_time' => $dest->opening_time,
                    'closing_time' => $dest->closing_time,
                    'best_visit_time' => $dest->best_visit_time,
                    'distance_from_prev' => $distanceFromPrev ? round($distanceFromPrev, 2) : null,
                    'coordinates' => [
                        'lat' => (float) $dest->latitude,
                        'lng' => (float) $dest->longitude,
                    ],
                    // Solo traveler fields
                    'solo_friendly_score' => $dest->solo_friendly_score,
                    'solo_tips' => $dest->solo_tips,
                    'activities' => $dest->activities ?? [],
                    'crowd_level' => $dest->crowd_level ?? [],
                    'parking_fee' => $dest->parking_fee ?? 0,
                    'food_price_range' => $dest->food_price_range ?? ['min' => 15000, 'max' => 50000],
                ];
            })->values()->all();

            $optimized[] = [
                'day' => $dayNum,
                'destinations' => $formattedDestinations,
            ];
        }

        return $optimized;
    }

    /**
     * Sort destinations using Nearest Neighbor algorithm
     */
    protected function sortByNearestNeighbor(Collection $destinations): Collection
    {
        if ($destinations->count() <= 1) {
            return $destinations->values();
        }

        $sorted = collect();
        $remaining = $destinations->values();

        $current = $remaining->shift();
        $sorted->push($current);

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
     * Calculate complete budget breakdown
     */
    public function calculateCompleteBudget(
        array $days,
        int $totalPax,
        string $transportPreference,
        ?int $userBudgetPerDay = null
    ): array {
        $perDay = [];
        $grandTotalMin = 0;
        $grandTotalMax = 0;

        foreach ($days as $day) {
            $dayNum = $day['day'];
            $destinations = $day['destinations'];

            $ticketsCost = 0;
            $transportCost = 0;
            $foodMin = 0;
            $foodMax = 0;
            $parkingCost = 0;

            foreach ($destinations as $index => $dest) {
                // Tickets
                $ticketsCost += ($dest['min_ticket_price'] ?? 0) * $totalPax;

                // Transport (calculate from distance)
                if ($index > 0 && $dest['distance_from_prev']) {
                    $transportCalc = $this->transportService->calculateTransportCost(
                        $dest['distance_from_prev'],
                        $totalPax,
                        $transportPreference
                    );
                    $transportCost += $transportCalc['cost'];
                }

                // Food
                $foodRange = $dest['food_price_range'] ?? ['min' => 15000, 'max' => 50000];
                $foodMin += ($foodRange['min'] ?? 15000) * $totalPax;
                $foodMax += ($foodRange['max'] ?? 50000) * $totalPax;

                // Parking
                $parkingCost += $dest['parking_fee'] ?? 0;
            }

            // Add buffer for first trip of the day (from hotel)
            $transportCost += $this->transportService->calculateTransportCost(10, $totalPax, $transportPreference)['cost'];

            $daySubtotalMin = $ticketsCost + $transportCost + $foodMin + $parkingCost;
            $daySubtotalMax = $ticketsCost + $transportCost + $foodMax + $parkingCost;

            $perDay[] = [
                'day' => $dayNum,
                'tickets' => $ticketsCost,
                'transport' => $transportCost,
                'food_estimate' => [
                    'min' => $foodMin,
                    'max' => $foodMax,
                ],
                'parking' => $parkingCost,
                'subtotal' => [
                    'min' => $daySubtotalMin,
                    'max' => $daySubtotalMax,
                ],
            ];

            $grandTotalMin += $daySubtotalMin;
            $grandTotalMax += $daySubtotalMax;
        }

        // Calculate budget status
        $totalDays = count($days);
        $userTotalBudget = $userBudgetPerDay ? $userBudgetPerDay * $totalPax * $totalDays : null;

        $status = null;
        $tips = null;

        if ($userTotalBudget) {
            $avgTotal = ($grandTotalMin + $grandTotalMax) / 2;

            if ($avgTotal <= $userTotalBudget * 0.8) {
                $remaining = $userTotalBudget - $avgTotal;
                $status = 'under_budget';
                $tips = "Budget Anda sangat cukup! Sisa ±Rp" . number_format($remaining, 0, ',', '.') . " untuk oleh-oleh atau upgrade pengalaman";
            } elseif ($avgTotal <= $userTotalBudget) {
                $status = 'within_budget';
                $tips = "Budget Anda pas! Pertimbangkan membawa dana cadangan 10-20%";
            } else {
                $over = $avgTotal - $userTotalBudget;
                $status = 'over_budget';
                $tips = "Budget kurang ±Rp" . number_format($over, 0, ',', '.') . ". Coba kurangi destinasi atau pilih yang lebih hemat";
            }
        }

        return [
            'per_day' => $perDay,
            'grand_total' => [
                'min' => $grandTotalMin,
                'max' => $grandTotalMax,
            ],
            'user_budget' => $userTotalBudget,
            'status' => $status,
            'tips' => $tips,
        ];
    }

    /**
     * Regenerate specific day
     */
    public function regenerateDay(array $preferences, int $dayNumber, array $excludeIds = []): array
    {
        $result = $this->generate($preferences);

        if (!$result['success']) {
            return $result;
        }

        // Only return the specific day
        $day = collect($result['data']['days'])->firstWhere('day', $dayNumber);

        return [
            'success' => true,
            'data' => [
                'day' => $day,
            ],
        ];
    }

    /**
     * Suggest replacement for a specific destination
     */
    public function suggestReplacement(
        int $cityId,
        int $excludeId,
        ?int $categoryId = null,
        string $priority = 'balanced',
        bool $isSoloMode = false,
        int $limit = 5
    ): array {
        $query = Destination::with(['zone', 'category', 'ticketVariants'])
            ->whereHas('zone', fn($q) => $q->where('city_id', $cityId))
            ->where('id', '!=', $excludeId);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $destinations = $query->get();

        $weights = $this->getWeightsByPriority($priority);
        if ($isSoloMode) {
            $weights['solo_friendly'] = 0.15;
            foreach (['rating', 'price', 'popularity', 'time_match'] as $key) {
                $weights[$key] *= 0.85;
            }
        }

        $popularityData = $this->getPopularityData();
        $priceStats = $this->getPriceStats($destinations);

        $scored = $this->calculateScores($destinations, $weights, $popularityData, $priceStats, $isSoloMode);

        return $scored->take($limit)->map(function ($dest) {
            return [
                'id' => $dest->id,
                'name' => $dest->name,
                'description' => $dest->description,
                'image_url' => $dest->image_url,
                'category' => $dest->category->name ?? null,
                'zone' => $dest->zone->name ?? null,
                'score' => $dest->calculated_score,
                'badges' => $dest->badges,
                'min_ticket_price' => $dest->min_ticket_price,
                'rating' => (float) $dest->rating,
            ];
        })->values()->all();
    }
}
