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
        Schema::create('members', function (Blueprint $table) {
            $table->string('member_id', 30)->primary();
            $table->string('name', 100);
            $table->string('phone', 30)->unique();
            $table->string('member_category', 50)->default('Umum');
            $table->decimal('discount_pct', 5, 2)->default(0.00);
            $table->integer('loyalty_points')->default(0);
            $table->decimal('total_spent', 14, 2)->default(0.00);
            $table->enum('status', ['AKTIF', 'NONAKTIF'])->default('AKTIF');
            $table->timestamps();
        });

        Schema::create('customer_debts', function (Blueprint $table) {
            $table->string('debt_id', 30)->primary();
            $table->string('invoice_no', 40)->nullable();
            $table->string('member_id', 30)->nullable();
            $table->string('customer_name', 100);
            $table->string('phone', 30);
            $table->text('address')->nullable();
            $table->decimal('total_debt', 12, 2);
            $table->decimal('down_payment', 12, 2)->default(0.00);
            $table->decimal('remaining_debt', 12, 2);
            $table->date('due_date');
            $table->enum('status', ['BELUM_LUNAS', 'LUNAS'])->default('BELUM_LUNAS');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('member_id')->on('members')->onDelete('set null');
        });

        Schema::create('debt_payment_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->string('debt_id', 30);
            $table->decimal('amount_paid', 12, 2);
            $table->string('payment_method', 30)->default('TUNAI');
            $table->string('received_by', 50)->default('Kasir');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('debt_id')->references('debt_id')->on('customer_debts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debt_payment_logs');
        Schema::dropIfExists('customer_debts');
        Schema::dropIfExists('members');
    }
};
