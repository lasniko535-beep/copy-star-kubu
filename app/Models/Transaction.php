<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $primaryKey = 'invoice_no';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'invoice_no',
        'user_id',
        'member_id',
        'shift_id',
        'subtotal_amount',
        'discount_amount',
        'final_amount',
        'payment_method',
        'cash_received',
        'cash_change',
        'status',
        'location_place',
        'notes',
    ];

    protected $casts = [
        'subtotal_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'cash_received' => 'decimal:2',
        'cash_change' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(CashShift::class, 'shift_id', 'shift_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class, 'invoice_no', 'invoice_no');
    }
}
