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
        Schema::create('products', function (Blueprint $table) {
            $table->string('product_id', 30)->primary();
            $table->string('category_id', 30);
            $table->string('sku_barcode', 50)->unique()->nullable();
            $table->string('name', 150);
            $table->boolean('is_service')->default(false);
            $table->string('unit', 20)->default('Pcs');
            $table->decimal('cost_price', 12, 2)->default(0.00);
            $table->decimal('sell_price', 12, 2);
            $table->decimal('wholesale_price', 12, 2)->nullable();
            $table->integer('wholesale_min_qty')->default(5)->nullable();
            $table->integer('stock_qty')->default(0);
            $table->integer('min_stock_alert')->default(10);
            $table->string('tiered_pricing_key', 50)->nullable();
            $table->boolean('is_dead_stock')->default(false);
            $table->timestamp('last_sold_at')->nullable();
            $table->enum('status', ['AKTIF', 'NONAKTIF'])->default('AKTIF');
            $table->timestamps();

            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
