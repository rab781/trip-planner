<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    //
    protected $fillable = ['name', 'image_url'];

    public function itineraries()
    {
        return $this->hasMany(Itinerary::class);
    }

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }

}
