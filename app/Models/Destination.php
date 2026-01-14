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
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:2',
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
