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
        Schema::create('tiered_pricing_rules', function (Blueprint $table) {
            $table->id('tier_id');
            $table->string('tier_group_key', 50); // 'copy_bw', 'copy_color', 'print_doc_bw'
            $table->integer('min_qty');
            $table->integer('max_qty');
            $table->decimal('price_per_unit', 10, 2);
            $table->string('label', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiered_pricing_rules');
    }
};
