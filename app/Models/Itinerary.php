<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    protected $fillable = [
        'user_id',
        'city_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'total_pax_count',
        'transportation_preference',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['total_days', 'estimated_budget'];

    public function getTotalDaysAttribute()
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    public function getEstimatedBudgetAttribute()
    {
        $itemTotal = $this->itineraryItems->sum('total_cost');
        $lodgingTotal = $this->itineraryLodgings->sum('total_cost');
        return $itemTotal + $lodgingTotal;
    }

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
