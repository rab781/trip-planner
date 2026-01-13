<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryItem extends Model
{
    //
    protected $fillable = [
        'iternarary_id',
        'destination_id',
        'day_number',
        'sequence_order',
        'est_start_time',
        'est_end_time',
        'dist_from_prev_km',
        'transportation_mode',
        'est_transport_cost'
    ];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'iternarary_id');
    }
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function itineraryItemDetails()
    {
        return $this->hasMany(ItineraryItemDetail::class, 'internary_item_id');
    }
}
