<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    //
    protected $fillable = [
        'zone_id',
        'category_id',
        'name',
        'description',
        'image_url',
        'latitude',
        'longitude',
        'rating',
        'best_visit_time',
        'opening_time',
        'closing_time',
        'avg_visit_duration_minutes',
        // Solo traveler fields
        'solo_friendly_score',
        'solo_tips',
        'activities',
        'crowd_level',
        'parking_fee',
        'food_price_range',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:2',
        'activities' => 'array',
        'crowd_level' => 'array',
        'food_price_range' => 'array',
    ];

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function ticketVariants()
    {
        return $this->hasMany(TicketVariant::class);
    }

    public function itineraryItems()
    {
        return $this->hasMany(ItineraryItem::class);
    }
}
