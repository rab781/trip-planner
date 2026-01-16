<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zone;

class ZoneController extends Controller
{
    //Get /api/zones
    public function index()
    {
        $Zones = Zone::all();
        return response()->json(
            [
                'data' => $Zones,
                'message' => 'Zones retrieved successfully',
                'status' => 200,
            ]
        );

        if (!$Zones) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No Zones found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Get /api/zones/{id}
    public function show($id)
    {
        $Zone = Zone::find($id);

        if ($Zone) {
            return response()->json(
                [
                    'data' => $Zone,
                    'message' => 'Zone retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Zone not found',
                    'status' => 404,
                ],
                404
            );
        }
    }
}
