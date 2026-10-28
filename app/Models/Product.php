<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $primaryKey = 'product_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'category_id',
        'sku_barcode',
        'name',
        'is_service',
        'unit',
        'cost_price',
        'sell_price',
        'wholesale_price',
        'wholesale_min_qty',
        'stock_qty',
        'min_stock_alert',
        'tiered_pricing_key',
        'is_dead_stock',
        'last_sold_at',
        'status',
    ];

    protected $casts = [
        'is_service' => 'boolean',
        'is_dead_stock' => 'boolean',
        'cost_price' => 'decimal:2',
        'sell_price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'last_sold_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function transactionItems(): HasMany
    {
        return $this->hasMany(TransactionItem::class, 'product_id', 'product_id');
    }
}
