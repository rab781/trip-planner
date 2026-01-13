<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    //
    protected $fillable =
    [
        'user_id',
        'city_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'total_days',
        'total_pax_count',
        'transportation_preference',
        'estimated_budget'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function itineraryItems()
    {
        return $this->hasMany(ItineraryItem::class);
    }

    public function itineraryLodgings()
    {
        return $this->hasMany(ItineraryLodging::class);
    }
}
