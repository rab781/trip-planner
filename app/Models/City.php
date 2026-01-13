<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class city extends Model
{
    //
    protected $fillable = ['name',' image_url'];

    public function iternerary()
    {
        return $this->hasMany(Itinerary::class);
    }

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
    
}
