<?php

namespace Tests\Unit;

use App\Helpers\DistanceHelper;
use App\Services\TransportService;
use Tests\TestCase;

class SmartItineraryTest extends TestCase
{
    /** @test */
    public function it_can_calculate_distance_using_haversine()
    {
        // Tangkuban Perahu ke Farmhouse Lembang
        $distance = DistanceHelper::calculateDistance(
            -6.7597,  // Tangkuban Perahu lat
            107.6098, // Tangkuban Perahu lng
            -6.8103,  // Farmhouse lat
            107.6176  // Farmhouse lng
        );

        // Distance should be around 5-6 km
        $this->assertGreaterThan(5, $distance);
        $this->assertLessThan(7, $distance);
    }

    /** @test */
    public function it_selects_motor_for_single_passenger()
    {
        $service = new TransportService();

        // Even without DB, should use fallback rates
        $result = $service->calculateTransportCost(10, 1);

        $this->assertEquals('MOTOR', $result['vehicle_type']);
        $this->assertEquals(10, $result['distance_km']);
        $this->assertEquals(5000, $result['base_fare']); // Fallback base fare
        $this->assertEquals(2500, $result['rate_per_km']); // Fallback rate
        $this->assertArrayHasKey('cost', $result);
    }

    /** @test */
    public function it_selects_car_for_multiple_passengers()
    {
        $service = new TransportService();

        $result = $service->calculateTransportCost(10, 4);

        $this->assertEquals('CAR', $result['vehicle_type']);
        $this->assertEquals(10000, $result['base_fare']); // Fallback for CAR
        $this->assertEquals(4000, $result['rate_per_km']); // Fallback for CAR
        $this->assertGreaterThan(0, $result['cost']);
    }

    /** @test */
    public function it_calculates_transport_cost_correctly()
    {
        $service = new TransportService();

        // Motor: base_fare 5000 + (10km * 2500) = 30000
        $result = $service->calculateTransportCost(10, 1);

        $this->assertEquals(30000, $result['cost']);
    }
}
