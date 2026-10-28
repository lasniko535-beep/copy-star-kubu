<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashShift extends Model
{
    protected $primaryKey = 'shift_id';

    protected $fillable = [
        'user_id',
        'cashier_name',
        'opened_at',
        'closed_at',
        'starting_cash',
        'expected_cash',
        'actual_cash',
        'variance',
        'status',
        'notes',
    ];

    protected $casts = [
        'starting_cash' => 'decimal:2',
        'expected_cash' => 'decimal:2',
        'actual_cash' => 'decimal:2',
        'variance' => 'decimal:2',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'shift_id', 'shift_id');
    }
}
