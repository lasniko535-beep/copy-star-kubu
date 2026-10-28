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
        Schema::create('cash_shifts', function (Blueprint $table) {
            $table->id('shift_id');
            $table->string('user_id', 30);
            $table->string('cashier_name', 100);
            $table->timestamp('opened_at')->useCurrent();
            $table->timestamp('closed_at')->nullable();
            $table->decimal('starting_cash', 12, 2)->default(0.00);
            $table->decimal('expected_cash', 12, 2)->default(0.00);
            $table->decimal('actual_cash', 12, 2)->nullable();
            $table->decimal('variance', 12, 2)->nullable();
            $table->enum('status', ['OPEN', 'CLOSED'])->default('OPEN');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->string('invoice_no', 40)->primary();
            $table->string('user_id', 30)->nullable();
            $table->string('member_id', 30)->nullable();
            $table->unsignedBigInteger('shift_id')->nullable();
            $table->decimal('subtotal_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0.00);
            $table->decimal('final_amount', 12, 2);
            $table->string('payment_method', 30)->default('TUNAI'); // TUNAI, QRIS, TRANSFER, KASBON, SPLIT
            $table->decimal('cash_received', 12, 2)->default(0.00);
            $table->decimal('cash_change', 12, 2)->default(0.00);
            $table->enum('status', ['PAID', 'VOID', 'PENDING'])->default('PAID');
            $table->string('location_place', 150)->default('COPY STAR KUBU - Meja Kasir 1 (Jln. Soeparto 1 Kubu)');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
            $table->foreign('member_id')->references('member_id')->on('members')->onDelete('set null');
            $table->foreign('shift_id')->references('shift_id')->on('cash_shifts')->onDelete('set null');
            $table->index(['created_at', 'status']);
        });

        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id('item_id');
            $table->string('invoice_no', 40);
            $table->string('product_id', 30)->nullable();
            $table->string('product_name', 150);
            $table->decimal('unit_sell_price', 12, 2);
            $table->decimal('unit_cost_price', 12, 2)->default(0.00);
            $table->integer('qty')->default(1);
            $table->decimal('discount_item', 12, 2)->default(0.00);
            $table->decimal('subtotal', 12, 2);
            $table->text('item_notes')->nullable();
            $table->timestamps();

            $table->foreign('invoice_no')->references('invoice_no')->on('transactions')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('set null');
            $table->index('invoice_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('cash_shifts');
    }
};
