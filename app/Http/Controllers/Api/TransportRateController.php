<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TransportRate;

class TransportRateController extends Controller
{
    //Get /api/transport-rates
    public function index()
    {
        $TransportRates = TransportRate::all();
        return response()->json(
            [
                'data' => $TransportRates,
                'message' => 'Transport Rates retrieved successfully',
                'status' => 200,
            ]
        );

        if (!$TransportRates) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No Transport Rates found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Get /api/transport-rates/{id}
    public function show($id)
    {
        $TransportRates = TransportRate::find($id);
        if ($TransportRates) {
            return response()->json(
                [
                    'data' => $TransportRates,
                    'message' => 'Transport Rate retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Transport Rate not found',
                    'status' => 404,
                ],
                404
            );
        }
    }
}
