<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
        'image_url',
        'latitude',
        'longitude',
        'rating',
        'category_id',
        'zone_id',
        'best_time_to_visit',
        'opening_time',
        'closing_time',
        'avg_visit_duration_minutes',
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

    public function itenararyItems()
    {
        return $this->hasMany(ItineraryItem::class);
    }
}
