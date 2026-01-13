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
        'is_mandatory'
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function itenararyItemsDetail()
    {
        return $this->hasMany(ItineraryItemDetail::class);
    }
}
