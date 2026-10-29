<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'city_id', 'color_code'];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function destinations()
    {
        return $this->hasMany(Destination::class);
    }
}
