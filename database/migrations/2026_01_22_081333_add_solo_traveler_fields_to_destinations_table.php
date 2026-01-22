<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            // Solo traveler fields
            $table->unsignedTinyInteger('solo_friendly_score')->default(3)->after('rating')
                ->comment('1-5 score for solo traveler comfort');
            $table->text('solo_tips')->nullable()->after('solo_friendly_score')
                ->comment('Tips for solo travelers');
            $table->json('activities')->nullable()->after('solo_tips')
                ->comment('List of activities: [{name, duration_min, description, photo_spot}]');
            $table->json('crowd_level')->nullable()->after('activities')
                ->comment('Crowd level per hour: {"09:00": "low", "12:00": "high"}');
            $table->unsignedInteger('parking_fee')->default(0)->after('crowd_level')
                ->comment('Parking fee estimate in IDR');
            $table->json('food_price_range')->nullable()->after('parking_fee')
                ->comment('Food price range: {min: 15000, max: 50000}');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn([
                'solo_friendly_score',
                'solo_tips',
                'activities',
                'crowd_level',
                'parking_fee',
                'food_price_range'
            ]);
        });
    }
};
