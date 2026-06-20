<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Destination;

class DestinationController extends Controller
{
    //Get /api/destinations
    public function index()
    {
        // ⚡ Bolt: Cache destination index to prevent querying entire destinations table on every API request
        $Destinations = \Illuminate\Support\Facades\Cache::remember('api_destinations_index', now()->addMinutes(15), function() {
            return Destination::all();
        });

        if ($Destinations->isEmpty()) {
            return response()->json(
                [
                    'data' => [],
                    'message' => 'No Destinations found',
                    'status' => 200,
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => $Destinations,
                'message' => 'Destinations retrieved successfully',
                'status' => 200,
            ]
        );
    }
    // Get /api/destinations/{id}
    public function show($id)
    {
        $Destinations = Destination::find($id);
        if ($Destinations) {
            return response()->json(
                [
                    'data' => $Destinations,
                    'message' => 'Destination retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Destination not found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Additional methods (store, update, destroy) can be added here as needed
}
