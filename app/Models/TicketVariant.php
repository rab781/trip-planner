<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketVariant extends Model
{
    //
    protected $fillable =
    [
        'name',
        'price',
        'is_mandatory',
        'destination_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_mandatory' => 'boolean',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function itineraryItemDetails()
    {
        return $this->hasMany(ItineraryItemDetail::class);
    }
}
