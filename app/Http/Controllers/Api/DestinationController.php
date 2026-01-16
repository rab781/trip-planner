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
        $Destinations = Destination::all();
        return response()->json(
            [
                'data' => $Destinations,
                'message' => 'Destinations retrieved successfully',
                'status' => 200,
            ]
        );

        if (!$Destinations) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No Destinations found',
                    'status' => 404,
                ],
                404
            );
        }
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
