<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

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
