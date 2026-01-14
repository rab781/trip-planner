<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryLodging extends Model
{
    //
    protected $fillable = [
        'name',
        'itinerary_id',
        'latitude',
        'longitude',
        'check_in_date',
        'check_out_date',
        'cost_per_night',
        'total_cost',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'cost_per_night' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class);
    }
}
