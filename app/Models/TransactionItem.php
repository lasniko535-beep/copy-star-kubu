<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionItem extends Model
{
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'invoice_no',
        'product_id',
        'product_name',
        'unit_sell_price',
        'unit_cost_price',
        'qty',
        'discount_item',
        'subtotal',
        'item_notes',
    ];

    protected $casts = [
        'unit_sell_price' => 'decimal:2',
        'unit_cost_price' => 'decimal:2',
        'discount_item' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'invoice_no', 'invoice_no');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
