<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerDebt extends Model
{
    protected $primaryKey = 'debt_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'debt_id',
        'invoice_no',
        'member_id',
        'customer_name',
        'phone',
        'address',
        'total_debt',
        'down_payment',
        'remaining_debt',
        'due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_debt' => 'decimal:2',
        'down_payment' => 'decimal:2',
        'remaining_debt' => 'decimal:2',
        'due_date' => 'date',
    ];
}
