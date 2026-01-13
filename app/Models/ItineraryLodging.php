<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryLodging extends Model
{
    //
    public $fillable = [
        'name',
        'itinerary_id',
        'latitude',
        'longitude',
        'check_in_date',
        'check_out_date',
        'cost_per_night',
        'total_cost',
    ];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class);
    }
}
