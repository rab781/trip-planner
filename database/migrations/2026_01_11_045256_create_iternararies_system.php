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
        Schema::create('iternararies', function (Blueprint $table) {
            $table->id();
            $table->id('user_id');
            $table->id('city_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->integer('total_days');
            $table->integer('total_pax_count')->default(1);
            $table->string('transportation_preference')->nullable();
            $table->decimal('estimated_budget', 10, 2)->nullable();
            $table->timestamps('created_at');
        });

        Schema::create('internary_lodgings', function( Blueprint $table) {
            $table->id();
            $table->id('iternarary_id');
            $table->string('name');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->decimal('cost_per_night', 8, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('internary_items', function( Blueprint $table) {
            $table->id();
            $table->id('iternarary_id');
            $table->id('destination_id');
            $table->integer('day_number');
            $table->integer('sequence_order');
            $table->time('est_start_time')->nullable();
            $table->time('est_end_time')->nullable();
            $table->float('dist_from_prev_km')->nullable();
            $table->string('transportation_mode')->nullable();
            $table->decimal('est_transport_cost', 8, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('internary_item_details', function (Blueprint $table){
            $table->id();
            $table->id('internary_item_id');
            $table->id('ticket_variant_id')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('sub_total', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iternararies');
        Schema::dropIfExists('internary_lodgings');
        Schema::dropIfExists('internary_items');
        Schema::dropIfExists('internary_item_details');
    }
};
