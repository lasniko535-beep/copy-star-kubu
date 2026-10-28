<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'username',
        'password_hash',
        'full_name',
        'role',
        'phone',
        'email',
        'shift_name',
        'is_active',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'user_id', 'user_id');
    }

    public function cashShifts(): HasMany
    {
        return $this->hasMany(CashShift::class, 'user_id', 'user_id');
    }
}
