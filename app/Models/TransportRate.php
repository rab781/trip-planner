<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportRate extends Model
{
    //
    protected $fillable = ['transport_type', 'base_fare', 'rate_per_km'];

    protected $casts = [
        'base_fare' => 'decimal:2',
        'rate_per_km' => 'decimal:2',
    ];
}
