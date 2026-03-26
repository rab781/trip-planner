<?php

namespace App\Services;

use App\Models\TransportRate;

class TransportService
{
    /**
     * Cache for transport rates to prevent N+1 queries during loops
     * @var array
     */
    protected array $ratesCache = [];

    /**
     * Calculate transport cost based on distance and passenger count
     *
     * @param float $distanceKm Distance in kilometers
     * @param int $paxCount Number of passengers
     * @return array ['vehicle_type' => string, 'cost' => float]
     */
    public function calculateTransportCost(float $distanceKm, int $paxCount = 1): array
    {
        // Determine vehicle type based on passenger count
        // Motor: max 1 passenger
        // Car: 2+ passengers
        $vehicleType = $paxCount <= 1 ? 'MOTOR' : 'CAR';

        // ⚡ Bolt: Check local cache first to prevent N+1 DB queries in loops (e.g., budget calculations)
        if (isset($this->ratesCache[$vehicleType])) {
            $baseFare = $this->ratesCache[$vehicleType]['base'];
            $ratePerKm = $this->ratesCache[$vehicleType]['per_km'];
        } else {
            // Try to get rate from database
            try {
                $rate = TransportRate::where('transport_type', $vehicleType)->first();

                if ($rate) {
                    $baseFare = $rate->base_fare;
                    $ratePerKm = $rate->rate_per_km;
                } else {
                    // Fallback to default rates if not found in DB
                    $baseFare = $vehicleType === 'MOTOR' ? 5000 : 10000;
                    $ratePerKm = $vehicleType === 'MOTOR' ? 2500 : 4000;
                }
            } catch (\Exception $e) {
                // Fallback to default rates if DB error (e.g., in testing)
                $baseFare = $vehicleType === 'MOTOR' ? 5000 : 10000;
                $ratePerKm = $vehicleType === 'MOTOR' ? 2500 : 4000;
            }

            // Cache for subsequent calls
            $this->ratesCache[$vehicleType] = [
                'base' => $baseFare,
                'per_km' => $ratePerKm,
            ];
        }

        // Calculate total cost
        $totalCost = $baseFare + ($distanceKm * $ratePerKm);

        return [
            'vehicle_type' => $vehicleType,
            'cost' => round($totalCost, 0),
            'distance_km' => $distanceKm,
            'base_fare' => $baseFare,
            'rate_per_km' => $ratePerKm,
        ];
    }

    /**
     * Get all available transport rates
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTransportRates()
    {
        return TransportRate::all();
    }
}
