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
        Schema::create('users', function (Blueprint $table) {
            $table->string('user_id', 30)->primary();
            $table->string('username', 50)->unique();
            $table->string('password_hash', 255);
            $table->string('full_name', 100);
            $table->enum('role', ['KASIR', 'OWNER'])->default('KASIR');
            $table->string('phone', 30)->unique();
            $table->string('email', 100)->unique()->nullable();
            $table->string('shift_name', 50)->default('Pagi (08:00 - 16:00)');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('password_reset_requests', function (Blueprint $table) {
            $table->id('reset_id');
            $table->string('user_id', 30);
            $table->string('identifier', 100);
            $table->string('otp_code', 10);
            $table->boolean('is_used')->default(false);
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_requests');
        Schema::dropIfExists('users');
    }
};
