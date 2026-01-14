<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryItem extends Model
{
    //
    protected $fillable = [
        'itinerary_id',
        'destination_id',
        'day_number',
        'sequence_order',
        'est_start_time',
        'est_end_time',
        'dist_from_prev_km',
        'transportation_mode',
        'est_transport_cost'
    ];

    protected $casts = [
        'est_transport_cost' => 'decimal:2',
        'dist_from_prev_km' => 'float',
    ];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class);
    }
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function itineraryItemDetails()
    {
        return $this->hasMany(ItineraryItemDetail::class);
    }
}
