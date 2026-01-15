<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    // Get /api/cities
    public function index()
    {
        $cities = City::withcount('zones')->get();

        return response()->json(
            [
                'data' => $cities,
                'message' => 'Cities retrieved successfully',
                'status' => 200,
            ]
        );

        if (!$cities) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No cities found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Get /api/cities/{id}
    public function show($id)
    {
        $city = City::with('zones')->find($id);

        if ($city) {
            return response()->json(
                [
                    'data' => $city,
                    'message' => 'City retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'City not found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Get /api/cities/{id}/zones
    public function zones($id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'City not found',
                    'status' => 404,
                ],
                404
            );
        }

        $zones = $city->zones;

        return response()->json(
            [
                'data' => $zones,
                'message' => 'Zones retrieved successfully',
                'status' => 200,
            ]
        );
    }

    // Additional methods for creating, updating, and deleting cities can be added here


}
