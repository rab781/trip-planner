<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryItemDetail extends Model
{
    //
    protected $fillable = [
        'itinerary_item_id',
        'ticket_variant_id',
        'quantity',
        'sub_total'
    ];

    public function itineraryItem()
    {
        return $this->belongsTo(ItineraryItem::class);
    }

    public function ticketVariant()
    {
        return $this->belongsTo(TicketVariant::class);
    }
}
