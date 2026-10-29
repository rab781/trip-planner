<?php

namespace Tests\Feature\Api;

use App\Models\Zone;
use App\Models\City;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ZoneControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_all_zones_successfully()
    {
        Zone::factory()->count(3)->create();

        $response = $this->getJson('/api/zones');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'city_id', 'created_at', 'updated_at']
                     ],
                     'message',
                     'status'
                 ])
                 ->assertJsonCount(3, 'data')
                 ->assertJsonPath('message', 'Zones retrieved successfully')
                 ->assertJsonPath('status', 200);
    }

    public function test_it_returns_empty_data_when_no_zones_exist()
    {
        $response = $this->getJson('/api/zones');

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [],
                     'message' => 'Zones retrieved successfully',
                     'status' => 200,
                 ]);
    }
}
