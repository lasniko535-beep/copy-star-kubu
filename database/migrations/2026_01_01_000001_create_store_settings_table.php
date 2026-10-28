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
        Schema::create('store_settings', function (Blueprint $table) {
            $table->string('store_id', 20)->primary();
            $table->string('store_name', 100)->default('COPY STAR KUBU');
            $table->string('tagline', 150)->default('Digital Photocopy, Photo Printing & ATK');
            $table->text('address')->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('receipt_footer')->nullable();
            $table->string('supervisor_pin', 10)->default('0000');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};
